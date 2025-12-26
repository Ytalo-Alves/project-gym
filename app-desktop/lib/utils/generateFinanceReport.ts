import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportOptions {
  type: string;
  startDate: string;
  endDate: string;
}

export const generateFinanceReport = async ({
  type,
  startDate,
  endDate,
}: ReportOptions) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // --- Color Palette ---
  const colors = {
    primary: [16, 185, 129], // Emerald 500
    primaryLight: [209, 250, 229], // Emerald 100
    dark: [24, 24, 27], // Zinc 950
    gray: [113, 113, 122], // Zinc 500
    lightGray: [244, 244, 245], // Zinc 100
    border: [228, 228, 231], // Zinc 200
    white: [255, 255, 255],
    success: [34, 197, 94], // Green 500
    warning: [234, 179, 8], // Yellow 500
    danger: [239, 68, 68], // Red 500
  };

  // --- Load and Add Logo ---
  try {
    const logoImg = await loadImage("/Logo.png");
    doc.addImage(logoImg, "PNG", 14, 10, 30, 30);
  } catch (error) {
    console.error("Failed to load logo:", error);
  }

  // --- Header Section ---
  doc.setFillColor(
    colors.primaryLight[0],
    colors.primaryLight[1],
    colors.primaryLight[2]
  );
  doc.rect(0, 0, pageWidth, 50, "F");

  // Company Name
  doc.setFontSize(20);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text("GYM MONSTER", 50, 22);

  // Subtitle
  doc.setFontSize(9);
  doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
  doc.setFont("helvetica", "normal");
  doc.text("Sistema de Gestão de Academia", 50, 28);
  doc.text("CNPJ: 12.345.678/0001-90", 50, 33);

  // Report Title - Right Aligned
  const title =
    type === "revenue"
      ? "RELATÓRIO DE FATURAMENTO"
      : type === "defaults"
      ? "RELATÓRIO DE INADIMPLÊNCIA"
      : type === "expenses"
      ? "RELATÓRIO DE DESPESAS"
      : "BALANÇO MENSAL";

  doc.setFontSize(14);
  doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  doc.setFont("helvetica", "bold");
  doc.text(title, pageWidth - 14, 22, { align: "right" });

  // Date Range
  doc.setFontSize(9);
  doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Período: ${formatDate(startDate)} até ${formatDate(endDate)}`,
    pageWidth - 14,
    28,
    { align: "right" }
  );
  doc.text(`Gerado em: ${formatDateTime(new Date())}`, pageWidth - 14, 33, {
    align: "right",
  });

  // --- Summary Cards Section ---
  let yPos = 60;
  doc.setFontSize(11);
  doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  doc.setFont("helvetica", "bold");
  doc.text("RESUMO EXECUTIVO", 14, yPos);

  yPos += 8;
  const summaryData = getSummaryData(type);
  const cardWidth = (pageWidth - 28 - 10) / 3; // 3 cards with spacing

  summaryData.forEach((item, index) => {
    const xPos = 14 + (cardWidth + 5) * index;

    // Card background with gradient effect (simulated with overlapping rectangles)
    doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.roundedRect(xPos, yPos, cardWidth, 28, 3, 3, "F");

    // Border
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(xPos, yPos, cardWidth, 28, 3, 3, "S");

    // Accent bar
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.roundedRect(xPos, yPos, cardWidth, 4, 3, 3, "F");

    // Label
    doc.setFontSize(7);
    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
    doc.setFont("helvetica", "normal");
    doc.text(item.label.toUpperCase(), xPos + 3, yPos + 10);

    // Value
    doc.setFontSize(16);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.setFont("helvetica", "bold");
    doc.text(item.value, xPos + 3, yPos + 20);

    // Change indicator (if applicable)
    if (item.change) {
      doc.setFontSize(7);
      const changeColor = item.change.startsWith("+")
        ? colors.success
        : colors.danger;
      doc.setTextColor(changeColor[0], changeColor[1], changeColor[2]);
      doc.text(item.change, xPos + 3, yPos + 25);
    }
  });

  // --- Additional Metrics Section ---
  yPos += 38;
  const additionalMetrics = getAdditionalMetrics(type);

  if (additionalMetrics.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.setFont("helvetica", "bold");
    doc.text("INDICADORES DETALHADOS", 14, yPos);

    yPos += 6;
    doc.setFillColor(
      colors.lightGray[0],
      colors.lightGray[1],
      colors.lightGray[2]
    );
    doc.rect(14, yPos, pageWidth - 28, 20, "F");

    const metricsPerRow = 2;
    const metricWidth = (pageWidth - 28) / metricsPerRow;

    additionalMetrics.forEach((metric, index) => {
      const row = Math.floor(index / metricsPerRow);
      const col = index % metricsPerRow;
      const xPos = 14 + col * metricWidth;
      const yOffset = yPos + 5 + row * 10;

      doc.setFontSize(8);
      doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
      doc.setFont("helvetica", "normal");
      doc.text(metric.label + ":", xPos + 3, yOffset);

      doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
      doc.setFont("helvetica", "bold");
      doc.text(metric.value, xPos + 50, yOffset);
    });

    yPos += 25;
  }

  // --- Detailed Table Section ---
  yPos += 5;
  doc.setFontSize(11);
  doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
  doc.setFont("helvetica", "bold");
  doc.text("DETALHAMENTO", 14, yPos);

  const tableData = getTableData(type, startDate, endDate);

  autoTable(doc, {
    startY: yPos + 5,
    head: [tableData.headers],
    body: tableData.rows,
    theme: "striped",
    styles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: [82, 82, 91],
      lineColor: [228, 228, 231],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [39, 39, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    columnStyles: tableData.columnStyles,
    didDrawPage: (data) => {
      // Add page footer on each page
      addPageFooter(doc, pageWidth, pageHeight, colors);
    },
  });

  // --- Summary Footer (on last page) ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  if (finalY < pageHeight - 40) {
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.line(14, finalY, pageWidth - 14, finalY);

    doc.setFontSize(9);
    doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Este relatório foi gerado automaticamente pelo sistema Gym Monster.",
      14,
      finalY + 8
    );
    doc.text(
      "Para dúvidas ou esclarecimentos, entre em contato com o setor financeiro.",
      14,
      finalY + 13
    );
  }

  // Save the PDF
  const fileName = `relatorio-${type}-${formatDateForFilename(new Date())}.pdf`;
  doc.save(fileName);
};

// Helper functions
function formatDate(dateString: string): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

function getRandomDate(start: string, end: string): string {
  const startDate = start ? new Date(start) : new Date(2024, 0, 1);
  const endDate = end ? new Date(end) : new Date();
  const date = new Date(
    startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime())
  );
  return date.toLocaleDateString("pt-BR");
}

// --- Helper Functions ---

function getSummaryData(type: string) {
  const colors = {
    primary: [16, 185, 129],
    success: [34, 197, 94],
    warning: [234, 179, 8],
    danger: [239, 68, 68],
  };

  if (type === "revenue") {
    return [
      {
        label: "Faturamento Total",
        value: "R$ 125.430,00",
        change: "+12.5%",
        color: colors.primary,
      },
      {
        label: "Ticket Médio",
        value: "R$ 115,00",
        change: "+5.2%",
        color: colors.success,
      },
      {
        label: "Total de Pagamentos",
        value: "1.090",
        change: "+8.3%",
        color: colors.primary,
      },
    ];
  } else if (type === "defaults") {
    return [
      {
        label: "Total em Atraso",
        value: "R$ 4.250,00",
        change: "-3.2%",
        color: colors.danger,
      },
      {
        label: "Alunos Inadimplentes",
        value: "28",
        change: "-2",
        color: colors.warning,
      },
      {
        label: "Taxa de Inadimplência",
        value: "2.57%",
        change: "-0.3%",
        color: colors.success,
      },
    ];
  } else if (type === "expenses") {
    return [
      {
        label: "Despesas Totais",
        value: "R$ 45.230,00",
        change: "+4.1%",
        color: colors.danger,
      },
      {
        label: "Despesas Fixas",
        value: "R$ 32.100,00",
        change: "0%",
        color: colors.warning,
      },
      {
        label: "Despesas Variáveis",
        value: "R$ 13.130,00",
        change: "+15.2%",
        color: colors.danger,
      },
    ];
  } else {
    return [
      {
        label: "Receita Total",
        value: "R$ 125.430,00",
        change: "+12.5%",
        color: colors.success,
      },
      {
        label: "Despesas Totais",
        value: "R$ 45.230,00",
        change: "+4.1%",
        color: colors.danger,
      },
      {
        label: "Lucro Líquido",
        value: "R$ 80.200,00",
        change: "+18.3%",
        color: colors.primary,
      },
    ];
  }
}

function getAdditionalMetrics(type: string) {
  if (type === "revenue") {
    return [
      { label: "Novas Matrículas", value: "45 alunos" },
      { label: "Renovações", value: "98 contratos" },
      { label: "Cancelamentos", value: "12 alunos" },
      { label: "Taxa de Retenção", value: "94.2%" },
    ];
  } else if (type === "defaults") {
    return [
      { label: "Atraso Médio", value: "15 dias" },
      { label: "Maior Débito", value: "R$ 387,60" },
      { label: "Recuperação no Mês", value: "R$ 1.250,00" },
      { label: "Alunos Contatados", value: "28 de 28" },
    ];
  } else if (type === "expenses") {
    return [
      { label: "Folha de Pagamento", value: "R$ 28.500,00" },
      { label: "Aluguel e Condomínio", value: "R$ 8.200,00" },
      { label: "Equipamentos", value: "R$ 3.450,00" },
      { label: "Marketing", value: "R$ 2.100,00" },
    ];
  } else {
    return [
      { label: "Margem de Lucro", value: "63.9%" },
      { label: "Alunos Ativos", value: "1.090" },
      { label: "Receita por Aluno", value: "R$ 115,07" },
      { label: "Crescimento Mensal", value: "+8.3%" },
    ];
  }
}

function getTableData(
  type: string,
  startDate: string,
  endDate: string
): {
  headers: string[];
  rows: string[][];
  columnStyles: any;
} {
  if (type === "revenue") {
    return {
      headers: ["Data", "Descrição", "Aluno", "Plano", "Forma Pgto", "Valor"],
      rows: Array.from({ length: 25 }).map((_, i) => {
        const plans = ["Premium", "Básico", "VIP"];
        const payments = ["PIX", "Cartão", "Dinheiro", "Débito"];
        const plan = plans[i % 3];
        const value =
          plan === "Premium" ? "129,90" : plan === "VIP" ? "199,90" : "89,90";

        return [
          getRandomDate(startDate, endDate),
          "Mensalidade",
          `Aluno #${1000 + i}`,
          plan,
          payments[i % 4],
          `R$ ${value}`,
        ];
      }),
      columnStyles: {
        0: { cellWidth: 22, halign: "center" as const },
        1: { cellWidth: 28 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25, halign: "center" as const },
        4: { cellWidth: 25, halign: "center" as const },
        5: {
          cellWidth: 25,
          halign: "right" as const,
          fontStyle: "bold" as const,
        },
      },
    };
  } else if (type === "defaults") {
    return {
      headers: [
        "Aluno",
        "CPF",
        "Plano",
        "Vencimento",
        "Dias Atraso",
        "Valor Devido",
      ],
      rows: Array.from({ length: 28 }).map((_, i) => {
        const plans = ["Premium", "Básico"];
        const plan = plans[i % 2];
        const value = plan === "Premium" ? "129,90" : "89,90";
        const daysLate = Math.floor(Math.random() * 45) + 1;

        return [
          `Aluno Inadimplente #${i + 1}`,
          generateCPF(),
          plan,
          getRandomDate(startDate, endDate),
          `${daysLate} dias`,
          `R$ ${value}`,
        ];
      }),
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 30, halign: "center" as const },
        2: { cellWidth: 25, halign: "center" as const },
        3: { cellWidth: 25, halign: "center" as const },
        4: { cellWidth: 25, halign: "center" as const },
        5: {
          cellWidth: 25,
          halign: "right" as const,
          fontStyle: "bold" as const,
          textColor: [239, 68, 68] as [number, number, number],
        },
      },
    };
  } else if (type === "expenses") {
    return {
      headers: ["Data", "Categoria", "Descrição", "Fornecedor", "Valor"],
      rows: Array.from({ length: 20 }).map((_, i) => {
        const categories = [
          "Folha",
          "Aluguel",
          "Equipamentos",
          "Marketing",
          "Manutenção",
          "Utilidades",
        ];
        const category = categories[i % 6];
        const values = [
          "2.500,00",
          "8.200,00",
          "1.250,00",
          "850,00",
          "450,00",
          "320,00",
        ];

        return [
          getRandomDate(startDate, endDate),
          category,
          `Despesa ${category} - Item ${i + 1}`,
          `Fornecedor ${String.fromCharCode(65 + (i % 10))}`,
          `R$ ${values[i % 6]}`,
        ];
      }),
      columnStyles: {
        0: { cellWidth: 25, halign: "center" as const },
        1: { cellWidth: 30 },
        2: { cellWidth: 50 },
        3: { cellWidth: 35 },
        4: {
          cellWidth: 25,
          halign: "right" as const,
          fontStyle: "bold" as const,
        },
      },
    };
  } else {
    return {
      headers: ["Categoria", "Receitas", "Despesas", "Saldo", "% do Total"],
      rows: [
        ["Mensalidades", "R$ 98.500,00", "R$ 0,00", "R$ 98.500,00", "78.5%"],
        ["Matrículas", "R$ 15.200,00", "R$ 0,00", "R$ 15.200,00", "12.1%"],
        ["Personal Trainer", "R$ 8.450,00", "R$ 0,00", "R$ 8.450,00", "6.7%"],
        ["Outros Serviços", "R$ 3.280,00", "R$ 0,00", "R$ 3.280,00", "2.6%"],
        [
          "Folha de Pagamento",
          "R$ 0,00",
          "R$ 28.500,00",
          "-R$ 28.500,00",
          "63.0%",
        ],
        ["Aluguel", "R$ 0,00", "R$ 8.200,00", "-R$ 8.200,00", "18.1%"],
        ["Equipamentos", "R$ 0,00", "R$ 3.450,00", "-R$ 3.450,00", "7.6%"],
        ["Marketing", "R$ 0,00", "R$ 2.100,00", "-R$ 2.100,00", "4.6%"],
        ["Outros", "R$ 0,00", "R$ 2.980,00", "-R$ 2.980,00", "6.6%"],
      ],
      columnStyles: {
        0: { cellWidth: 50, fontStyle: "bold" as const },
        1: { cellWidth: 30, halign: "right" as const },
        2: { cellWidth: 30, halign: "right" as const },
        3: {
          cellWidth: 35,
          halign: "right" as const,
          fontStyle: "bold" as const,
        },
        4: { cellWidth: 25, halign: "center" as const },
      },
    };
  }
}

function addPageFooter(
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  colors: any
) {
  const pageCount = doc.getNumberOfPages();
  const currentPage = doc.getCurrentPageInfo().pageNumber;

  // Footer line
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

  // Footer text
  doc.setFontSize(7);
  doc.setTextColor(colors.gray[0], colors.gray[1], colors.gray[2]);
  doc.setFont("helvetica", "normal");
  doc.text("Gym Monster - Sistema de Gestão de Academia", 14, pageHeight - 14);
  doc.text("Documento Confidencial", 14, pageHeight - 10);

  // Page number
  doc.text(
    `Página ${currentPage} de ${pageCount}`,
    pageWidth - 14,
    pageHeight - 14,
    { align: "right" }
  );
}

function formatDateTime(date: Date): string {
  return (
    date.toLocaleDateString("pt-BR") +
    " às " +
    date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

function formatDateForFilename(date: Date): string {
  return date.toISOString().split("T")[0];
}

function generateCPF(): string {
  const randomDigits = () => Math.floor(Math.random() * 10);
  return `${randomDigits()}${randomDigits()}${randomDigits()}.${randomDigits()}${randomDigits()}${randomDigits()}.${randomDigits()}${randomDigits()}${randomDigits}-${randomDigits()}${randomDigits()}`;
}

async function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Failed to get canvas context"));
      }
    };
    img.onerror = reject;
    img.src = url;
  });
}
