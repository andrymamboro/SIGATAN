<?php
// Contoh endpoint API untuk generate PDF laporan
// Simpan file ini sebagai api/generate-laporan.php

require 'vendor/autoload.php'; // pastikan composer dan dompdf sudah diinstall
use Dompdf\Dompdf;

header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="laporan.pdf"');

// Data bisa diambil dari request atau database
$html = '<h1>Laporan Sigatan</h1><p>Ini adalah contoh laporan PDF yang digenerate dari backend.</p>';

$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
echo $dompdf->output();
exit;
