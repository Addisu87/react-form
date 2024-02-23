import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MdAddAPhoto } from "react-icons/md";
import { FaCamera, FaFileUpload } from "react-icons/fa";
import * as faceapi from "@vladmandic/face-api";

import { CommonData } from "../utils/commonUtils";
import { uploadPhoto } from "../redux/faceLoginSlice";

const FaceLogin = () => {
  const [imgSrc, setImgSrc] = useState(null);

  // Add reference to the webcam
  // access the webcam instance and take a screenshot
  const webcamRef = useRef(null);
  const canvasRef = useRef(null); // Add a canvas ref

  const dispatch = useDispatch();
  const { error, upload, picLoading } = useSelector((state) => state.faceLogin);
  // Get the loading state for initSessionID
  const { isLoading } = useSelector((state) => state.init);

  const {
    time,
    ip,
    os,
    device,
    location,
    timezone,
    language,
    browser,
    mainparams,
    randomSession,
    redirectUrl,
  } = CommonData();

  // face recognition models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, []);

  // create a capture function
  const handleCapture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    try {
      const detections = await faceapi
        .detectAllFaces(imageSrc)
        .withFaceLandmarks();

      console.log("Detections:", detections);

      // Access your canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw rectangles around detected faces
      detections.forEach((detection, landmarks) => {
        // Draw rectangle
        const box = detection.box;
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);

        // Draw landmarks
        // faceapi.draw.drawFaceLandmarks(canvas, landmarks, { drawLines: true });

        // Draw landmarks
        landmarks.positions.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI, true);
          ctx.fillStyle = "blue";
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = "blue";
          ctx.stroke();
        });
      });
    } catch (error) {
      console.error("Error detecting faces:", error);
    }
  }, [webcamRef, setImgSrc, canvasRef]);

  const handleRetake = () => {
    setImgSrc(null);
  };

  const handleUpload = async () => {
    // Check if imageSrc is not null
    if (!imgSrc) {
      toast.error("No image to upload.");
      return;
    }

    try {
      // Additional data
      const additionalData = {
        time,
        ip,
        os,
        device,
        location,
        timezone,
        language,
        browser,
        mainparams,
        randomSession,
        redirectUrl,
      };

      // Create FormData and append the image directly
      let formData = new FormData();
      formData.append("image", imgSrc);

      // Append additional data to formData
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });

      console.log("Data", imgSrc, additionalData);
      // Dispatch the action with both formData and additional data
      await dispatch(uploadPhoto(formData));
    } catch (error) {
      // Handle error
      console.error("Error uploading photo:", error);
    }
  };

  //  Use useEffect to show success and error messages using react-toastify
  useEffect(() => {
    const showToast = (message, isSuccess = false) => {
      if (message && !picLoading) {
        isSuccess ? toast.success(message) : toast.error(message);
      }
    };

    showToast(upload, true);
    showToast(error);
  }, [error, upload, picLoading]);

  // Render loading state while initializing session ID
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center relative">
      <div className="bg-gray-200 rounded-xl p-2">
        {imgSrc ? (
          <div className="mt-4 space-y-2">
            <img
              src={imgSrc}
              alt="CapturedPhoto"
              className="w-full h-auto rounded-md shadow-md"
            />
            <div className="text-center md:text-left space-y-6">
              <div className="flex space-x-3 items-center justify-center">
                <button
                  type="button"
                  className="flex items-center justify-center h-10 px-6 font-semibold rounded-md border bg-green-500 hover:bg-green-700 text-white"
                  onClick={handleRetake}
                >
                  <MdAddAPhoto className="mr-2" />
                  Retake
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center h-10 px-6 font-semibold rounded-md border bg-green-500 hover:bg-green-700 text-white"
                  onClick={handleUpload}
                >
                  <FaFileUpload className="mr-2" />
                  Upload
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              height={240}
              className="mb-2 rounded-md"
            />
            {/* Canvas for drawing overlay */}
            <canvas
              ref={canvasRef}
              width={320}
              height={240}
              style={{ position: "absolute", top: 0, left: 0 }}
            ></canvas>

            <button
              type="button"
              className="flex items-center justify-center w-full h-10 px-4 font-semibold rounded-md border bg-green-500 hover:bg-green-700 text-white"
              onClick={handleCapture}
            >
              <FaCamera className="mr-2" />
              Capture
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FaceLogin;
