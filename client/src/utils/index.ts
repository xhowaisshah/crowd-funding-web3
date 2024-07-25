export const daysLeft = (deadline: string): string => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);
  
    return remainingDays.toFixed(0);
  };
  
  export const calculateBarPercentage = (goal: number, raisedAmount: number): number => {
    const percentage = Math.round((raisedAmount * 100) / goal);
  
    return percentage;
  };
  
  export const checkIfImage = (url: string, callback: (isImage: boolean) => void): void => {
    const img = new Image();
    img.src = url;
  
    if (img.complete) callback(true);
  
    img.onload = () => callback(true);
    img.onerror = () => callback(false);
  };

  export const isImageAvailable = (imageUrl: string | undefined): boolean => {
    if (imageUrl) {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', imageUrl, false);
      try {
        xhr.send();
        return xhr.status >= 200 && xhr.status < 300;
      } catch (error) {
        console.error('Error fetching image:', error);
        return false;
      }
    } else {
      return false;
    }
  };