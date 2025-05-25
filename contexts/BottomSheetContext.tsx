import React, { createContext, useState, useContext, ReactNode } from "react";

interface BottomSheetContextType {
  isSheetOpen: boolean;
  sheetContent: ReactNode | null;
  openSheet: (content: ReactNode) => void;
  closeSheet: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetContent, setSheetContent] = useState<ReactNode | null>(null);

  const openSheet = (content: ReactNode) => {
    setSheetContent(content);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setSheetContent(null); // Clear content when sheet is closed
  };

  return (
    <BottomSheetContext.Provider
      value={{ isSheetOpen, sheetContent, openSheet, closeSheet }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (context === undefined) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }
  return context;
};
