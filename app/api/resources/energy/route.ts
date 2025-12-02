import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month';

    // Mock energy consumption data
    const energyData = {
      period,
      electricity: {
        current: 45000, // kWh
        previous: 48000,
        change: -6.25,
        cost: 450000, // DA
        peakHours: "14:00-16:00",
        averageDaily: 1500,
      },
      water: {
        current: 12000, // m³
        previous: 11500,
        change: 4.35,
        cost: 120000, // DA
        averageDaily: 400,
      },
      gas: {
        current: 8000, // m³
        previous: 8500,
        change: -5.88,
        cost: 160000, // DA
        averageDaily: 267,
      },
      carbon: {
        total: 125.5, // tonnes CO₂
        electricity: 85.5,
        gas: 40,
        target: 100,
        reduction: -25.5,
      },
      predictions: {
        nextMonth: {
          electricity: 43000,
          water: 12500,
          gas: 7500,
          carbon: 118,
        },
        recommendations: [
          {
            type: "solar_panels",
            description: "Installer panneaux solaires sur toits",
            descriptionAr: "تركيب ألواح شمسية على الأسطح",
            savings: 15000, // kWh/month
            cost: 5000000, // DA
            roi: 3.2, // years
            carbonReduction: 25, // tonnes/year
          },
          {
            type: "led_lighting",
            description: "Remplacer éclairage par LED",
            descriptionAr: "استبدال الإضاءة بLED",
            savings: 8000,
            cost: 500000,
            roi: 0.8,
            carbonReduction: 12,
          },
          {
            type: "smart_hvac",
            description: "Système de climatisation intelligent",
            descriptionAr: "نظام تكييف ذكي",
            savings: 12000,
            cost: 2000000,
            roi: 1.5,
            carbonReduction: 18,
          },
        ],
      },
      historicalData: [
        { month: "Septembre", electricity: 42000, water: 11000, gas: 7500 },
        { month: "Octobre", electricity: 44000, water: 11500, gas: 8000 },
        { month: "Novembre", electricity: 46000, water: 11800, gas: 8300 },
        { month: "Décembre", electricity: 48000, water: 12000, gas: 8500 },
        { month: "Janvier", electricity: 45000, water: 12000, gas: 8000 },
      ],
    };

    return NextResponse.json(energyData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch energy data' },
      { status: 500 }
    );
  }
}
