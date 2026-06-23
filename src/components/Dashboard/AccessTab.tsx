'use client';

import { useEffect, useState } from 'react';
import {
  Shield,
  CreditCard,
  Globe,
  User,
  Phone,
  Mail,
  Loader2,
  ExternalLink,
  QrCode,
} from 'lucide-react';
import { Button, Card, Tag, Spin } from 'antd';
import { getMyBusinessCardForDashboard } from '@/api/Api';

interface BusinessCardData {
  id: number;
  name: string;
  professional_title: string;
  bio: string;
  email: string;
  phone: string;
  business_name: string;
  website: string;
  business_card_link: string;
  business_card_qr: string;
  payment_status: string;
  subscription_status: string;
  status: string;
}

export const AccessTab = () => {
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState<BusinessCardData | null>(null);

  useEffect(() => {
    fetchCard();
  }, []);

  const fetchCard = async () => {
    try {
      setLoading(true);

      const businessCardId = localStorage.getItem('businessCardId');

      const res = await getMyBusinessCardForDashboard(
        Number(businessCardId)
      );

      if (res?.success) {
        setCardData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = () => {
    // Payment page route
    window.location.href = '/checkout';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!cardData) {
    return (
      <Card>
        <p>No access card found.</p>
      </Card>
    );
  }

  const isPending = cardData.payment_status === 'pending';

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={28} />
            <h2 className="text-2xl font-bold">Digital Access Card</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <Tag color={isPending ? 'orange' : 'green'}>
              Payment: {cardData.payment_status}
            </Tag>

            <Tag color="blue">
              Subscription: {cardData.subscription_status}
            </Tag>
          </div>
        </div>
      </Card>

      {/* Payment Pending */}
      {isPending ? (
        <Card>
          <div className="text-center py-10">
            <CreditCard
              size={70}
              className="mx-auto mb-4 text-orange-500"
            />

            <h3 className="text-2xl font-semibold mb-2">
              Complete Your Payment
            </h3>

            <p className="text-gray-500 mb-6">
              Your Access Card is ready. Complete payment to activate and
              unlock all features.
            </p>

            <Button
              type="primary"
              size="large"
              onClick={handlePayNow}
            >
              Pay Now
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Card Details */}
          <Card>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {cardData.name}
                  </h2>
                  <p className="text-pink-600 font-medium">
                    {cardData.professional_title}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    {cardData.business_name}
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={18} />
                    {cardData.email}
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    {cardData.phone}
                  </div>

                  <div className="flex items-center gap-2">
                    <Globe size={18} />
                    <a
                      href={cardData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>

                {cardData.bio && (
                  <div>
                    <h4 className="font-semibold mb-2">Bio</h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {cardData.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* QR */}
              <div className="w-full md:w-72">
                <Card>
                  <div className="text-center">
                    <QrCode
                      size={32}
                      className="mx-auto mb-3"
                    />

                    <img
                      src={cardData.business_card_qr}
                      alt="QR Code"
                      className="mx-auto w-52 h-52 object-contain"
                    />

                    <Button
                      type="primary"
                      icon={<ExternalLink size={16} />}
                      className="mt-4"
                      href={cardData.business_card_link}
                      target="_blank"
                    >
                      Open Card
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};