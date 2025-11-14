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