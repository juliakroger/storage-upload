import React from "react";
import ImageUploader from "@/components/ImageUploader";
import { createRoot } from "react-dom/client";
import "@/styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <div className="m-10">
      <ImageUploader />
    </div>
  </React.StrictMode>
);
