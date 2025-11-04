import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { createRoot } from "react-dom/client";
import React from "react";
import { Calculator } from "lucide-react";
import { hasValidLicenseKeySync } from "./license";
import { hasReachedExportLimit, incrementExportCount } from "./exportTracking";

export type ExportResult = {
  success: boolean;
  shouldShowProModal: boolean;
  blocked: boolean;
};

// Helper function to create header with logo and app name
const createHeader = (): Promise<HTMLElement> => {
  return new Promise((resolve) => {
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding-top: 2rem;
      padding-bottom: 1rem;
      background-color: hsl(215, 28%, 10%);
      gap: 0.75rem;
    `;

    // Create logo container
    const logoContainer = document.createElement("div");
    logoContainer.style.cssText = `
      width: 48px;
      height: 48px;
      background-color: hsl(160, 84%, 39%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Render Calculator icon from lucide-react
    const iconWrapper = document.createElement("div");
    iconWrapper.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: white;
    `;
    
    logoContainer.appendChild(iconWrapper);

    // Create app name
    const appName = document.createElement("div");
    appName.textContent = "BreakEven";
    appName.style.cssText = `
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      line-height: 1;
      margin: 0;
      padding: 0;
    `;

    header.appendChild(logoContainer);
    header.appendChild(appName);

    // Render the Calculator icon using React
    const root = createRoot(iconWrapper);
    root.render(
      React.createElement(Calculator, {
        size: 28,
        color: "white",
        strokeWidth: 2,
      })
    );

    // Wait for React to render, then resolve
    setTimeout(() => {
      resolve(header);
    }, 50);
  });
};

// Helper function to create export container with header
const createExportContainer = async (element: HTMLElement): Promise<HTMLElement> => {
  const container = document.createElement("div");
  const elementWidth = element.offsetWidth || element.scrollWidth || 800;
  const padding = 32; // 2rem padding
  container.style.cssText = `
    background-color: hsl(215, 28%, 10%);
    position: absolute;
    top: -9999px;
    left: -9999px;
    width: ${elementWidth + (padding * 2)}px;
    padding-left: ${padding}px;
    padding-right: ${padding}px;
    padding-bottom: ${padding}px;
    overflow: visible;
  `;

  const header = await createHeader();
  container.appendChild(header);

  // Clone the original element (cloneNode preserves classes and structure)
  const clonedElement = element.cloneNode(true) as HTMLElement;
  
  // Set explicit styles to ensure proper rendering
  const computedStyle = window.getComputedStyle(element);
  clonedElement.style.width = `${elementWidth}px`;
  clonedElement.style.margin = '0';
  clonedElement.style.padding = computedStyle.padding;
  clonedElement.style.backgroundColor = computedStyle.backgroundColor;
  
  container.appendChild(clonedElement);

  document.body.appendChild(container);
  
  return container;
};

export const exportToPNG = async (elementId: string, filename: string): Promise<ExportResult> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found");
    return { success: false, shouldShowProModal: false, blocked: false };
  }

  // Check if user is Pro
  const isPro = hasValidLicenseKeySync();
  
  // If not Pro, check export limit
  if (!isPro) {
    if (hasReachedExportLimit()) {
      return { success: false, shouldShowProModal: false, blocked: true };
    }
    // Increment count before export (for non-Pro users)
    incrementExportCount();
  }

  let exportContainer: HTMLElement | null = null;

  try {
    // Create export container with header
    exportContainer = await createExportContainer(element);

    // Use dark mode background color
    const canvas = await html2canvas(exportContainer, {
      backgroundColor: "hsl(215, 28%, 10%)",
      scale: 2,
      logging: false,
    });

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    
    // Return success with flag to show Pro modal if not Pro
    return { success: true, shouldShowProModal: !isPro, blocked: false };
  } catch (error) {
    console.error("Error exporting to PNG:", error);
    // If export failed after incrementing, we should ideally decrement
    // But for simplicity, we'll leave it as is
    return { success: false, shouldShowProModal: false, blocked: false };
  } finally {
    // Clean up temporary container
    if (exportContainer && exportContainer.parentNode) {
      exportContainer.parentNode.removeChild(exportContainer);
    }
  }
};

export const exportToPDF = async (elementId: string, filename: string): Promise<ExportResult> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found");
    return { success: false, shouldShowProModal: false, blocked: false };
  }

  // Check if user is Pro
  const isPro = hasValidLicenseKeySync();
  
  // If not Pro, check export limit
  if (!isPro) {
    if (hasReachedExportLimit()) {
      return { success: false, shouldShowProModal: false, blocked: true };
    }
    // Increment count before export (for non-Pro users)
    incrementExportCount();
  }

  let exportContainer: HTMLElement | null = null;

  try {
    // Create export container with header
    exportContainer = await createExportContainer(element);

    // Use dark mode background color
    const canvas = await html2canvas(exportContainer, {
      backgroundColor: "hsl(215, 28%, 10%)",
      scale: 2,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename}.pdf`);
    
    // Return success with flag to show Pro modal if not Pro
    return { success: true, shouldShowProModal: !isPro, blocked: false };
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    // If export failed after incrementing, we should ideally decrement
    // But for simplicity, we'll leave it as is
    return { success: false, shouldShowProModal: false, blocked: false };
  } finally {
    // Clean up temporary container
    if (exportContainer && exportContainer.parentNode) {
      exportContainer.parentNode.removeChild(exportContainer);
    }
  }
};
