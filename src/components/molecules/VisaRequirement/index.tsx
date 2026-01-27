"use client";

import React from "react";
import { AlertCircle, Clock, DollarSign, FileText, ExternalLink, CheckCircle } from "lucide-react";
import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { type VisaRequirement } from "@/types/visa.types";

interface VisaRequirementProps {
  visa: VisaRequirement;
  className?: string;
}

const statusColors = {
  success: {
    bg: "bg-green-50 dark:bg-green-900/30",
    border: "border-green-200 dark:border-green-700",
    text: "text-green-800 dark:text-green-200",
    icon: "text-green-600 dark:text-green-400",
    accent: "bg-green-100 dark:bg-green-800/40"
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-800 dark:text-yellow-200",
    icon: "text-yellow-600 dark:text-yellow-400",
    accent: "bg-yellow-100 dark:bg-yellow-800/40"
  },
  error: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-800 dark:text-red-200",
    icon: "text-red-600 dark:text-red-400",
    accent: "bg-red-100 dark:bg-red-800/40"
  },
  info: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-800 dark:text-blue-200",
    icon: "text-blue-600 dark:text-blue-400",
    accent: "bg-blue-100 dark:bg-blue-800/40"
  }
};

const statusIcons = {
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
  info: AlertCircle
};

export default function VisaRequirement({ visa, className = "" }: VisaRequirementProps) {
  const colors = statusColors[visa.status];
  const StatusIcon = statusIcons[visa.status];

  // Use "General Entry Policy" as default title unless it's already a general policy
  const displayTitle = visa.title.includes("Policy") || visa.title.includes("Entry") 
    ? visa.title 
    : "General Entry Policy";

  return (
    <Block className={`rounded-2xl border ${colors.border} ${colors.bg} ${className}`}>
      {/* Header */}
      <div className={`p-6 ${visa.status === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : ''} border-b border-gray-200 dark:border-gray-700`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${visa.status === 'success' ? colors.accent : colors.bg} ${visa.status === 'success' ? 'ring-2 ring-green-200 dark:ring-green-700' : ''}`}>
            <StatusIcon className={`w-6 h-6 ${colors.icon}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Typography variant="h3" className={`font-bold ${colors.text} ${visa.status === 'success' ? 'text-lg' : ''}`}>
                {displayTitle}
              </Typography>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${visa.status === 'success' ? colors.accent : colors.bg} ${colors.text}`}>
                {visa.type}
              </span>
            </div>
            <Typography variant="p" className={`${colors.text} leading-relaxed ${visa.status === 'success' ? 'font-medium' : ''}`}>
              {visa.description}
            </Typography>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className={`font-medium ${colors.text} ${visa.status === 'success' ? 'text-green-700 dark:text-green-300' : ''}`}>
                {visa.status === 'success' ? '✓ ' : ''}Stay: {visa.allowedStay}
              </span>
              {visa.processingTime && (
                <span className={`flex items-center gap-1 ${colors.text}`}>
                  <Clock className="w-4 h-4" />
                  {visa.processingTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cost Section */}
      {visa.cost && (
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-secondary" />
              <Typography variant="p" className="font-medium text-txt-main">
                Visa Cost
              </Typography>
            </div>
            <Typography variant="h3" className="font-bold text-txt-main">
              {visa.cost.currency} {visa.cost.amount}
            </Typography>
          </div>
        </div>
      )}

      {/* Documents Required */}
      {visa.documentsRequired && visa.documentsRequired.length > 0 && (
        <div className={`px-6 py-4 ${visa.status === 'success' ? colors.accent : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <FileText className={`w-5 h-5 ${visa.status === 'success' ? colors.icon : 'text-secondary'}`} />
            <Typography variant="p" className={`font-medium ${visa.status === 'success' ? colors.text : 'text-txt-main'}`}>
              Documents Required
            </Typography>
          </div>
          <ul className="space-y-2">
            {visa.documentsRequired.map((doc, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className={`w-4 h-4 ${visa.status === 'success' ? 'text-green-500' : 'text-green-500'} mt-0.5 flex-shrink-0`} />
                <Typography variant="p" className={`text-sm ${visa.status === 'success' ? colors.text : 'text-txt-main'}`}>
                  {visa.status === 'success' ? '✓ ' : ''}{doc}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      {visa.notes && (
        <div className="px-6 py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <Typography variant="p" className="text-txt-main text-sm italic">
              {visa.notes}
            </Typography>
          </div>
        </div>
      )}

      {/* Official Link */}
      {visa.officialLink && (
        <div className="p-6">
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={() => window.open(visa.officialLink, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Apply for E-Visa
          </Button>
        </div>
      )}
    </Block>
  );
}
