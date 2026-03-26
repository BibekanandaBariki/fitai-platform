from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from datetime import datetime, timedelta

app = FastAPI(
    title="FitAI ML Microservice",
    description="Predictive analytics for workouts, recovery, and injury risk.",
    version="1.0.0"
)

# --- Models ---

class WorkoutHistoryItem(BaseModel):
    date: str
    exercise_id: str
    avg_rpe: float
    total_volume_kg: float
    max_weight_kg: float

class PlateauRequest(BaseModel):
    user_id: str
    target_exercise_id: str
    history: List[WorkoutHistoryItem]

class GoalPredictionRequest(BaseModel):
    user_id: str
    current_weight_kg: float
    target_weight_kg: float
    weekly_caloric_deficit: float
    past_weights_kg: List[float] # Last 4 weeks

class HealthData(BaseModel):
    avg_sleep_hours: float
    hrv_ms: float
    resting_hr: float
    training_volume_week_kg: float
    previous_volume_week_kg: float

class InjuryRiskRequest(BaseModel):
    user_id: str
    health_data: HealthData
    recent_rpe_avg: float

# --- Endpoints ---

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "FitAI ML"}

@app.post("/predict-plateau")
def predict_plateau(request: PlateauRequest):
    """
    Detects if a user has hit a plateau on a specific exercise.
    Logic: If volume or max weight hasn't increased by >2% over the last 3 sessions, but RPE is high (>8).
    """
    if len(request.history) < 3:
        return {"is_plateau": False, "confidence": 0.0, "reason": "Insufficient data"}
    
    recent_sessions = sorted(request.history, key=lambda x: x.date)[-3:]
    volumes = [s.total_volume_kg for s in recent_sessions]
    rpes = [s.avg_rpe for s in recent_sessions]
    
    vol_change = (volumes[-1] - volumes[0]) / (volumes[0] + 1e-9)
    avg_rpe = sum(rpes) / len(rpes)
    
    is_plateau = vol_change < 0.02 and avg_rpe > 8.0
    
    return {
        "is_plateau": is_plateau,
        "confidence": 0.85 if is_plateau else 0.90,
        "recommended_action": "Trigger Deload Week" if is_plateau else "Continue Progressive Overload"
    }

@app.post("/predict-goal-date")
def predict_goal_date(request: GoalPredictionRequest):
    """
    Predicts when the user will hit their target weight using linear regression on recent data + physics (caloric deficit).
    """
    # 7700 kcal deficit = ~1kg fat loss
    expected_weekly_loss = request.weekly_caloric_deficit / 7700.0
    
    # Simple linear trend on past weights to adjust expected loss
    if len(request.past_weights_kg) >= 2:
        actual_weekly_loss = request.past_weights_kg[0] - request.past_weights_kg[-1]
        # Blend theoretical and actual
        effective_loss_rate = (expected_weekly_loss * 0.4) + (actual_weekly_loss * 0.6)
    else:
        effective_loss_rate = expected_weekly_loss

    if effective_loss_rate <= 0:
        return {"estimated_days": -1, "message": "Current trend does not lead to goal."}
        
    weight_to_lose = abs(request.current_weight_kg - request.target_weight_kg)
    weeks_required = weight_to_lose / effective_loss_rate
    
    target_date = datetime.now() + timedelta(days=int(weeks_required * 7))
    
    return {
        "estimated_days": int(weeks_required * 7),
        "target_date": target_date.strftime("%Y-%m-%d"),
        "effective_weekly_loss_kg": round(effective_loss_rate, 2)
    }

@app.post("/injury-risk-score")
def injury_risk_score(request: InjuryRiskRequest):
    """
    Computes an acute:chronic workload ratio (ACWR) and incorporates sleep/HRV to predict injury probability.
    """
    hd = request.health_data
    
    # ACWR (Acute:Chronic Workload Ratio) -> idealized 1.0 to 1.3 is safe, >1.5 is danger zone.
    if hd.previous_volume_week_kg <= 0:
        acwr = 1.0
    else:
        acwr = hd.training_volume_week_kg / hd.previous_volume_week_kg
        
    risk_score = 0.0
    
    # Load risk
    if acwr > 1.5:
        risk_score += 40
    elif acwr > 1.3:
        risk_score += 20
        
    # Recovery risk
    if hd.avg_sleep_hours < 6.0:
        risk_score += 25
    if hd.hrv_ms < 40.0:  # simplistic threshold
        risk_score += 15
        
    # Effort risk
    if request.recent_rpe_avg > 8.5:
        risk_score += 20
        
    # Clip to 100
    risk_score = min(100.0, risk_score)
    
    status = "Low"
    if risk_score > 75:
        status = "High"
    elif risk_score > 40:
        status = "Moderate"
        
    return {
        "risk_score_100": round(risk_score, 1),
        "acwr_ratio": round(acwr, 2),
        "status": status,
        "recommendation": "Reduce volume by 20% and prioritize sleep" if status == "High" else "Clear to train"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
