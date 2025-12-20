const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
const belasan = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];

function convertToWords(number) {
  if (number === 0) return 'Nol';
  if (number < 0) return 'Minus ' + convertToWords(Math.abs(number));

  let words = '';

  if (number >= 1000000000) {
    const billions = Math.floor(number / 1000000000);
    words += (billions === 1 ? 'Satu' : convertToWords(billions)) + ' Miliar ';
    number %= 1000000000;
  }

  if (number >= 1000000) {
    const millions = Math.floor(number / 1000000);
    words += (millions === 1 ? 'Satu' : convertToWords(millions)) + ' Juta ';
    number %= 1000000;
  }

  if (number >= 1000) {
    const thousands = Math.floor(number / 1000);
    words += (thousands === 1 ? 'Seribu' : convertToWords(thousands) + ' Ribu') + ' ';
    number %= 1000;
  }

  if (number >= 100) {
    const hundreds = Math.floor(number / 100);
    words += (hundreds === 1 ? 'Seratus' : satuan[hundreds] + ' Ratus') + ' ';
    number %= 100;
  }

  if (number >= 10 && number <= 19) {
    words += belasan[number - 10] + ' ';
    number = 0;
  }

  if (number >= 20) {
    const tens = Math.floor(number / 10);
    words += satuan[tens] + ' Puluh ';
    number %= 10;
  }

  if (number > 0) {
    words += satuan[number] + ' ';
  }

  return words.trim();
}

export function numberToWordsIDR(amount) {
  if (!amount || isNaN(amount)) return '';
  return convertToWords(Math.floor(Number(amount))) + ' Rupiah';
}

export function numberToWordsArea(area) {
  if (!area || isNaN(area)) return '';
  
  const numArea = Number(area);
  const integerPart = Math.floor(numArea);
  const decimalPart = numArea % 1;
  
  let result = convertToWords(integerPart);
  
  // Jika ada desimal, tambahkan "koma" dan bilangan desimalnya
  if (decimalPart > 0) {
    const decimalDigits = decimalPart.toFixed(2).split('.')[1]; // Ambil 2 digit desimal
    const firstDecimal = parseInt(decimalDigits[0]);
    const secondDecimal = parseInt(decimalDigits[1]);
    
    result += ' Koma';
    
    if (firstDecimal > 0) {
      result += ' ' + satuan[firstDecimal];
    } else {
      result += ' Nol';
    }
    
    if (secondDecimal > 0) {
      result += ' ' + satuan[secondDecimal];
    }
  }
  
  result += ' Meter Persegi';
  return result;
}