import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, color, subtext }) {
  const colorClasses = {
    blue: {
      card: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: 'bg-white/20 text-white',
      text: 'text-white',
      subtext: 'text-blue-100'
    },
    green: {
      card: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      icon: 'bg-white/20 text-white',
      text: 'text-white',
      subtext: 'text-emerald-100'
    },
    orange: {
      card: 'bg-gradient-to-br from-orange-500 to-orange-600',
      icon: 'bg-white/20 text-white',
      text: 'text-white',
      subtext: 'text-orange-100'
    },
    purple: {
      card: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: 'bg-white/20 text-white',
      text: 'text-white',
      subtext: 'text-purple-100'
    },
    red: {
      card: 'bg-gradient-to-br from-red-500 to-red-600',
      icon: 'bg-white/20 text-white',
      text: 'text-white',
      subtext: 'text-red-100'
    },
    yellow: {
      card: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
      icon: 'bg-white/20 text-white',
      text: 'text-white',
      subtext: 'text-yellow-100' // Ubah ke kuning
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${colors.card}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium mb-1 ${colors.subtext}`}>{title}</p>
              <h3 className={`text-3xl font-bold ${colors.text}`}>{value}</h3>
              {subtext && (
                <p className={`text-xs mt-1 ${colors.subtext}`}>{subtext}</p>
              )}
            </div>
            <div className={`p-3 rounded-xl ${colors.icon}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}