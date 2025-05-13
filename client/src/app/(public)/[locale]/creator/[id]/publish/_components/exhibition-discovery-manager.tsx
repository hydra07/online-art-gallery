'use client';

import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface DiscoveryManagerProps {
  isDiscoverable: boolean;
  isPublished: boolean;
  onToggle: (checked: boolean) => Promise<void>;
  isLoading: boolean;
}

export default function DiscoveryManager({
  isDiscoverable,
  isPublished,
  onToggle,
  isLoading
}: DiscoveryManagerProps) {
  const t = useTranslations('exhibitions');
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <Label className="text-lg font-semibold">
            {t('discoverable')}
          </Label>
          <p className="text-sm text-gray-500">
            {t('discoverable_description')}
          </p>
        </div>
        <Switch
          checked={isDiscoverable}
          onCheckedChange={onToggle}
          id="isDiscoverable"
          disabled={isLoading}
        />
      </div>
      {!isPublished && (
        <p className="text-sm text-amber-600 mt-2">
          {t('discovery_publish_first')}
        </p>
      )}
    </Card>
  );
}