export const convertToBase64 = (file, maxWidth = 200, maxHeight = 200, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
  
        img.onload = () => {
          // Tính toán kích thước mới
          let width = img.width;
          let height = img.height;
  
          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
  
          // Tạo canvas để resize và nén
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
  
          // Lấy base64 đã nén
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
  
        img.onerror = (err) => reject(err);
      };
  
      reader.onerror = (error) => reject(error);
    });
  };