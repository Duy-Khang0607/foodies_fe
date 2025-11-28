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

export const formatCurrency = (value) => {
  if (!value) return '';
  const number = value.toString().replace(/[^0-9]/g, '');
  if (!number) return '';
  // Convert to number and divide by 100 to get decimal places
  const numericValue = Number(number) / 100;
  return numericValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }) + ' $';
}

export const formatCurrencyDisplay = (value) => {
  if (!value) return '';
  const number = value.toString().replace(/[^0-9]/g, '');
  if (!number) return '';
  const numericValue = Number(number) / 100;
  return numericValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }) + ' $';
}

export const parseCurrencyInput = (value) => {
  if (!value) return '';
  return value.toString().replace(/[^0-9]/g, '');
}

export const convertToApiPrice = (displayValue) => {
  if (!displayValue) return '';
  const number = displayValue.toString().replace(/[^0-9]/g, '');
  if (!number) return '';
  // Convert back to decimal format for API (divide by 100)
  const numericValue = Number(number) / 100;
  return numericValue.toString();
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

//   "2025-11-13T03:52:32.416Z" -> 10:52 13/11/2025