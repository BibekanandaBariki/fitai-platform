"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Medal, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const mockLeaderboard = [
  { id: 1, name: 'Rahul Sharma', xp: 14500, level: 42, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', trend: 'up' },
  { id: 2, name: 'Priya Patel', xp: 13200, level: 39, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', trend: 'same' },
  { id: 3, name: 'Amit Kumar', xp: 12800, level: 38, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit', trend: 'up' },
  { id: 4, name: 'Neha Gupta', xp: 11500, level: 35, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha', trend: 'down' },
  { id: 5, name: 'Vikram Singh', xp: 10900, level: 34, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', trend: 'up' },
  { id: 6, name: 'Sneha Reddy', xp: 9800, level: 31, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha', trend: 'down' },
  { id: 7, name: 'You (Bibek)', xp: 8500, level: 28, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bibek', trend: 'up', isUser: true },
];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<'global' | 'friends' | 'city'>('global');

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard 🏆</h1>
          <p className="text-muted-foreground mt-1">
            See how you rank against the FitAI community.
          </p>
        </div>

        <div className="flex bg-secondary/50 rounded-lg p-1">
          <Button 
            variant={filter === 'global' ? 'default' : 'ghost'} 
            onClick={() => setFilter('global')}
            className="rounded-md"
          >
            Global
          </Button>
          <Button 
            variant={filter === 'friends' ? 'default' : 'ghost'} 
            onClick={() => setFilter('friends')}
            className="rounded-md"
          >
            Friends
          </Button>
          <Button 
            variant={filter === 'city' ? 'default' : 'ghost'} 
            onClick={() => setFilter('city')}
            className="rounded-md"
          >
            City
          </Button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end h-64 gap-2 md:gap-6 mt-12 mb-16">
        
        {/* Rank 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <Avatar className="w-16 h-16 md:w-20 md:h-20 border-4 border-slate-300 shadow-lg -mb-6 z-10">
            <AvatarImage src={mockLeaderboard[1].avatar} />
            <AvatarFallback>P2</AvatarFallback>
          </Avatar>
          <div className="bg-slate-200/20 w-24 md:w-32 h-32 rounded-t-lg border-t-4 border-slate-400 flex flex-col items-center justify-center pt-8">
            <span className="text-2xl font-bold text-slate-400">2</span>
            <span className="text-sm font-medium mt-2">{mockLeaderboard[1].name.split(' ')[0]}</span>
            <span className="text-xs text-muted-foreground">{mockLeaderboard[1].xp.toLocaleString()} XP</span>
          </div>
        </motion.div>

        {/* Rank 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <Crown className="w-8 h-8 text-yellow-500 mb-2 drop-shadow-md" />
          <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-yellow-400 shadow-xl -mb-8 z-10">
            <AvatarImage src={mockLeaderboard[0].avatar} />
            <AvatarFallback>P1</AvatarFallback>
          </Avatar>
          <div className="bg-yellow-500/20 w-28 md:w-36 h-40 rounded-t-lg border-t-4 border-yellow-500 flex flex-col items-center justify-center pt-10">
            <span className="text-3xl font-bold text-yellow-500">1</span>
            <span className="text-sm font-bold mt-2">{mockLeaderboard[0].name.split(' ')[0]}</span>
            <span className="text-xs font-semibold text-yellow-600/80 dark:text-yellow-400/80">{mockLeaderboard[0].xp.toLocaleString()} XP</span>
          </div>
        </motion.div>

        {/* Rank 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <Avatar className="w-14 h-14 md:w-16 md:h-16 border-4 border-orange-400/80 shadow-md -mb-4 z-10">
            <AvatarImage src={mockLeaderboard[2].avatar} />
            <AvatarFallback>P3</AvatarFallback>
          </Avatar>
          <div className="bg-orange-500/10 w-24 md:w-32 h-24 rounded-t-lg border-t-4 border-orange-500/60 flex flex-col items-center justify-center pt-6">
            <span className="text-xl font-bold text-orange-500/80">3</span>
            <span className="text-sm font-medium mt-1">{mockLeaderboard[2].name.split(' ')[0]}</span>
            <span className="text-xs text-muted-foreground">{mockLeaderboard[2].xp.toLocaleString()} XP</span>
          </div>
        </motion.div>

      </div>

      {/* Leaderboard List */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="divide-y divide-border/50">
          {mockLeaderboard.slice(3).map((player, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              key={player.id} 
              className={`flex items-center justify-between p-4 transition-colors hover:bg-muted/50 \${player.isUser ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex items-center gap-4">
                <span className="w-6 text-center text-lg font-semibold text-muted-foreground">
                  {index + 4}
                </span>
                <Avatar className="w-10 h-10 border border-border">
                  <AvatarImage src={player.avatar} />
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {player.name}
                    {player.isUser && <span className="text-[10px] uppercase bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">You</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">Level {player.level} • {player.trend === 'up' ? '🔥 Rising' : 'Keep pushing'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{player.xp.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">XP</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

    </div>
  );
}
