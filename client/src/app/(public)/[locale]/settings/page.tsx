"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import FileUploader from "@/components/ui.custom/file-uploader";
import {
  createArtistRequest,
} from "@/service/cccd";
import { getArtistRequest } from "@/service/artist-request";
import { getCurrentUser } from "@/lib/session";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | ''>('');
  const { data: session, status: sessionStatus } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // --- Authentication Handling ---
  useEffect(() => {
    if (sessionStatus === "loading") {
      setIsLoading(true);
      return; // Still loading session, wait.
    }
    if (sessionStatus === "unauthenticated" || !session?.user) {
      notFound(); // Redirect to not found or login page if not authenticated
    }
    // If authenticated, proceed to fetch data (implicitly handled by fetchArtistRequestData)
    setIsLoading(false);
  }, [sessionStatus, session]);

  // Biến lưu dữ liệu CCCD
  const [cccdData, setCccdData] = useState({
    id: "",
    name: "",
    dob: "",
    sex: "",
    nationality: "",
    home: "",
    address: "",
    doe: "",
    issue_date: "",
    issue_loc: "",
    features: "",
    mrz: "",
    // user: userId,
    imageFront: "",
    imageBack: "",
  });

  // --- Authentication Handling ---
  useEffect(() => {
    if (sessionStatus === "loading") {
      setIsLoading(true);
      return; // Still loading session, wait.
    }
    if (sessionStatus === "unauthenticated" || !session?.user) {
      setIsLoading(false); // Stop loading if unauthenticated
      notFound();
    }

    // If authenticated, proceed to fetch data
    if (sessionStatus === "authenticated" && session.user) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }

  }, [sessionStatus, session]);
  const fetchCurrentUser = async () => {

    const data = await getArtistRequest(session!.user.accessToken);
    if (data.data.artistRequest) {
      const artistRequest = data.data.artistRequest;
      setCccdData(artistRequest.cccd); // Cập nhật thông tin CCCD
      setStatus(artistRequest.status);
      setFrontImage(artistRequest.cccd.imageFront);
      setBackImage(artistRequest.cccd.imageBack);

      setCccdData((prev) => ({
        ...prev,
        imageFront: artistRequest.cccd.imageFront,
        imageBack: artistRequest.cccd.imageBack,
      }));
    }
  };

  const handleSaveCCCD = async () => {
    try {
      

      const result = await createArtistRequest({
        accessToken: session!.user.accessToken,
        cccdData: { ...cccdData},
      });

      if (result.statusCode === 201) {
        // alert("CCCD saved successfully. Request to become Artist sent!");
        setStatus(result.data.status);
      } else {
        const error = result.error;
        if (error.errorCode === 'cccd_used') {
          alert("This CCCD ID has already been registered by another user.");
        } else {
          alert(`Error: ${error.message}`);
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const processOcrData = async (file: File, isFrontImage: boolean) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const ocrResponse = await axios.post(
        "https://api.fpt.ai/vision/idr/vnm",
        formData,
        {
          headers: {
            "api-key": process.env.NEXT_PUBLIC_FPT_AI_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const responseData = ocrResponse.data;

      if (
        responseData.errorCode !== 0 ||
        !responseData.data ||
        responseData.data.length === 0
      ) {
        console.error(
          "Lỗi OCR hoặc dữ liệu không hợp lệ:",
          responseData.errorMessage
        );
        return;
      }

      const extractedData = responseData.data[0];

      if (isFrontImage) {
        setCccdData((prev) => ({
          ...prev,
          id: extractedData.id || prev.id,
          name: extractedData.name || prev.name,
          dob: extractedData.dob || prev.dob,
          sex: extractedData.sex || prev.sex,
          nationality: extractedData.nationality || prev.nationality,
          home: extractedData.home || prev.home,
          address: extractedData.address || prev.address,
          doe: extractedData.doe || prev.doe,
          issue_date: extractedData.issue_date || prev.issue_date,
          issue_loc: extractedData.issue_loc || prev.issue_loc,
          features: extractedData.features || prev.features,
          mrz: extractedData.mrz ? extractedData.mrz.join(" ") : prev.mrz,
        }));
      } else {
        setCccdData((prev) => ({
          ...prev,
          issue_date: extractedData.issue_date || prev.issue_date,
          issue_loc: extractedData.issue_loc || prev.issue_loc,
          features: extractedData.features || prev.features,
          mrz: extractedData.mrz ? extractedData.mrz.join(" ") : prev.mrz,
        }));
      }
    } catch (error) {
      console.error("Lỗi OCR:", error);
    }
  };

  const handleFrontImageUpload = async (url: string) => {
    setFrontImage(url);
    setCccdData((prev) => ({
      ...prev,
      imageFront: url,
    }));
  };

  const handleBackImageUpload = async (url: string) => {
    setBackImage(url);
    setCccdData((prev) => ({
      ...prev,
      imageBack: url,
    }));
  };

  const handleFrontFileChange = async (files: File[]) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Get the first file from the array

    const reader = new FileReader();
    reader.onloadend = () => setFrontImage(reader.result as string);
    reader.readAsDataURL(file);

    await processOcrData(file, true);
  };

  const handleBackFileChange = async (files: File[]) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Get the first file from the array

    const reader = new FileReader();
    reader.onloadend = () => setBackImage(reader.result as string);
    reader.readAsDataURL(file);

    await processOcrData(file, false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        {/* Add a spinner or loading text */}
        <p className="text-lg text-gray-600">Loading your details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg space-y-8">
      <h2 className="text-3xl font-semibold text-center text-gray-800">
        You must upload Citizen identification card to become Artist
      </h2>

      {/* Phần 1: Upload ảnh CCCD */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          1. Update citizen identification card
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {/* CCCD Mặt trước */}
          <Card className="border border-gray-300 rounded-lg shadow-sm">
            <CardContent className="p-4 flex flex-col items-center">
              <Label className="text-gray-600 mb-2">
                Front of citizen identification card
              </Label>
              {cccdData?.imageFront ? (
                <img
                  src={cccdData.imageFront}
                  alt="Front CCCD"
                  className="w-60 h-40 object-cover rounded-md"
                />
              ) : (
                <FileUploader
                  accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                  multiple={false}
                  onFileUpload={(files) => {
                    handleFrontImageUpload(files[0]?.url || "");
                  }}
                  onFilesChange={handleFrontFileChange}
                />
              )}
            </CardContent>
          </Card>

          {/* CCCD Mặt sau */}
          <Card className="border border-gray-300 rounded-lg shadow-sm">
            <CardContent className="p-4 flex flex-col items-center">
              <Label className="text-gray-600 mb-2">
                Back of citizen identification card
              </Label>
              {cccdData?.imageBack ? (
                <img
                  src={cccdData.imageBack}
                  alt="Back CCCD"
                  className="w-60 h-40 object-cover rounded-md"
                />
              ) : (
                <FileUploader
                  accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                  multiple={false}
                  onFileUpload={(files) => {
                    handleBackImageUpload(files[0]?.url || "");
                  }}
                  onFilesChange={handleBackFileChange}
                />
              )}
            </CardContent>
          </Card>
          {status === 'approved' ? (
            <p className="text-green-600 text-center col-span-2">
              Your request to become an Artist has been approved.
            </p>
          ) : status === 'rejected' ? (
            <div className="col-span-2 text-center">
              <p className="text-red-600 mb-2">
                Your artist application was rejected.
              </p>
              <Button
                onClick={handleSaveCCCD}
                className="w-full"
                disabled={!frontImage || !backImage}
              >
                Send new request
              </Button>
            </div>
          ) : status === 'pending' ? (
            <div className="col-span-2 text-center">
              <p className="text-yellow-600 mb-2">
                Your request is pending approval.
              </p>

            </div>
          ) : (
            <Button
              onClick={handleSaveCCCD}
              className="w-full col-span-2"
              disabled={!frontImage || !backImage}
            >
              Send request to admin
            </Button>
          )}

        </div>
      </div>
    </div>
  );
}
