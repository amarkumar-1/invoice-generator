export default function generateHTMLTPL0010(invoiceData) {
  let isDescriptionAvailable = false;

  invoiceData?.Items?.forEach((item) => {
    if (item["description"]) {
      isDescriptionAvailable = true;
    }
  });

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2); // Adding leading zero
    const day = `0${d.getDate()}`.slice(-2); // Adding leading zero
    return `${day}-${month}-${year}`;
  };

  const rupeeIcon = (w = 12, h = 12, color = "#000000") => {
    return `
      <svg
        fill="${color}"
        width="${w}px"
        height="${h}px"
        viewBox="-96 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M308 96c6.627 0 12-5.373 12-12V44c0-6.627-5.373-12-12-12H12C5.373 32 0 37.373 0 44v44.748c0 6.627 5.373 12 12 12h85.28c27.308 0 48.261 9.958 60.97 27.252H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h158.757c-6.217 36.086-32.961 58.632-74.757 58.632H12c-6.627 0-12 5.373-12 12v53.012c0 3.349 1.4 6.546 3.861 8.818l165.052 152.356a12.001 12.001 0 0 0 8.139 3.182h82.562c10.924 0 16.166-13.408 8.139-20.818L116.871 319.906c76.499-2.34 131.144-53.395 138.318-127.906H308c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-58.69c-3.486-11.541-8.28-22.246-14.252-32H308z" />
      </svg>
    `;
  };

  invoiceData["Invoice Issue Date"] = formatDate(
    invoiceData["Invoice Issue Date"]
  );
  invoiceData["Invoice Due Date"] = invoiceData["Invoice Due Date"]
    ? formatDate(invoiceData["Invoice Due Date"])
    : "";

  const escapeHTML = (text) => {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  };

  const remarksUI = invoiceData["Remarks"]
    ? `<div class="notes">
                <p class="align-left details-title">Notes:</p>
                <p class="align-left details-data">${escapeHTML(
                  invoiceData["Remarks"]
                )}</p>
            </div>`
    : "";

  const AdvancePaidAmount =
    invoiceData["Paid Amount"] && invoiceData.itemData["total"] !== "0.0"
      ? `<p class="details-data">Paid Amount</p>
          <p class="details-data data-limit">
            <span class="currency-symbol-cls">${rupeeIcon()}${Number(
          invoiceData["Paid Amount"]
        ).toFixed(2)}</span></p>`
      : "";

  const bankDetailsAvailable =
    invoiceData["Bank Name"] ||
    invoiceData["Account No"] ||
    invoiceData["Account Holder Name"] ||
    invoiceData["IFSC Code"] ||
    invoiceData["Bank Address"];

  return `
        
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Della+Respira&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <title>Invoice</title> 
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #fff;
    }

    .container-cls{
      max-width: 90%;
      margin: 0 auto;
      height: 100%;
    }
    
    .align-left{
      text-align: left;
    } 

    .align-right{
      text-align: right;
    }

    .v-align-top{
      vertical-align: top;
    }

    .w-10px{
      width: 10px;
    }
    
    .w-25{
      width: 25%;
    }

    .w-50{
      width: 50%;
    }

    .invoice-container p {
      margin: 0;
      padding: 0;
    }

    .invoice-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .invoice-header{
      background-color: #f1ebeb;
      height: 120px;
    }

    .invoice-header .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      height: 100%;
    }

    .invoice-header .header h1 {
      font-family: "Della Respira", serif;
      font-size: 3em;
      color: #545454;
      margin: 0;
      padding: 0;
      letter-spacing: 20px;
      line-height: unset;
    }

    .invoice-header .header figure {
      margin: 0;
      padding: 0;
      height: 100px;
    }

    .details-title{
      font-size: 18px;
      font-weight: 500;
      color: #545454;
    }

    .details-data{
      font-family: font-family: "Work Sans", sans-serif;
      font-optical-sizing: auto;
      font-size: 16px;
      font-weight: 400;
      font-style: normal;
      color: #777777;
    }

    .details {
      display: flex;
      justify-content: space-between;
      gap:10px;
      margin-top: 20px;
    }

    .details {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
    }

    .data-limit{
      max-width: 230px;
      word-wrap: break-word;
    }

    .table-data-limit{
      max-width: 100px;
      word-wrap: break-word;
    }
    .custom-field{
      font-weight: 600;
    }

    .invoice-container {
      font-family: "Work Sans", sans-serif !important;
      font-weight: 400;
      font-style: normal;
    }

    .invoice-number .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      align-items: center;
    } 

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .table th {
      font-size: 18px;
      font-weight: 500;
      color: #545454;
      padding: 0.2em 0.5em;
      background-color: #f1ebeb;
    }

    .table td {
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      color: #555555;
      padding: 10px;
    }

    .table td .description {
      color: #777777 !important;
      font-size: 16px;  
    }

    .totals {
      display: flex;
      justify-content: flex-end;
      text-align: right;
      margin-top: 20px;
      width: 100%;
      margin-bottom: 5px;
    }
    
    .totals .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      align-items: center;
    } 

    .totals p {
      display: block;
    }

    .total-details {
      display: flex;
      flex-direction: column;
    }

    .total-details p{
      padding: 16px;
    }
    
    .result-container {
      display: flex;
      background-color: #f1ebeb;
      justify-content: space-between;
      padding: 0.5em;
      margin-top: 1em;  
    }

    .result-container .result {
      color: #545454;
      font-size: 18px;
    }

    .notes{
        margin-top: 10px;
    }
    .terms {
      margin-top: 40px;
      font-size: 14px;
      max-width: 500px;
    }
  
    .terms .grid-container {
      display: grid;
      grid-template-columns: 1fr 4fr;
      gap: 10px;
      align-items: center;
    }

    .terms h3 {
      margin-bottom: 10px;
    }

    .currency-symbol-cls {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    @media print {
      .invoice-header .header h1 {
        font-size: 3.5em;
        
      }
      .table th {
        font-size: 16px
      }
     
      .table td {
        font-size: 14px
      }
      
      .details{
        line-height: 20px;
      }

      .table td .description {
        font-size: 14px;  
      }

      .details-title{
        font-size: 16px;
      }

      .details-data{
        font-size: 14px;
      }

      .terms{
        page-break-inside: avoid;
        page-break-after: always;
      }

      .terms .grid-container {
        grid-template-columns: 1fr 3fr;
        gap: 8px;
      }

      @page {
          margin: 0.5cm;
      }
    
    }
  </style>
</head>
<body>
  <div class="invoice-container">
  <header class="invoice-header">
  <div class="container-cls">
    <div class="header">
      <h1>INVOICE</h1>
      <figure>
        ${
          invoiceData["Logo"]
            ? `<img src=${invoiceData["Logo"]} alt="Company Logo">`
            : ""
        }
      </figure>
      </div>
    </div>
  </header>
  <main class="invoice-main">
  <div class="container-cls">
    <div class="details">
      <div class="data-limit">
        <p class="details-title">FROM</p>
        ${
          invoiceData["Sender's Name"]
            ? `<p class="details-data">${invoiceData["Sender's Name"]}</p>`
            : ""
        }
        ${
          invoiceData["Sender's Address"] || invoiceData["Sender's City"]
            ? `<p class="details-data">
          ${
            invoiceData["Sender's Address"]
              ? `${invoiceData["Sender's Address"]}, `
              : ""
          }
          ${invoiceData["Sender's City"] || ""}
          </p>`
            : ""
        }
        ${
          invoiceData["Sender's Zipcode"] || invoiceData["Sender's State"]
            ? `<p class="details-data">
          ${
            invoiceData["Sender's State"]
              ? `${invoiceData["Sender's State"]}, `
              : ""
          }
          ${
            invoiceData["Sender's Zipcode"]
              ? `${invoiceData["Sender's Zipcode"]}`
              : ""
          }
          </p>`
            : ""
        }
        ${
          invoiceData["Sender's Contact No"]
            ? `<p class="details-data">+91-${invoiceData["Sender's Contact No"]}</p>`
            : ""
        }
        ${
          invoiceData["Sender's Email"]
            ? `<p class="details-data">${invoiceData["Sender's Email"]}</p>`
            : ""
        }
        ${
          invoiceData["Sender's Tax No"]
            ? `<p class="details-data">GST No: ${invoiceData["Sender's Tax No"]}</p>`
            : ""
        }
        ${
          invoiceData["Sender's PAN No"]
            ? `<p class="details-data">PAN No: ${invoiceData["Sender's PAN No"]}</p>`
            : ""
        }
        ${
          invoiceData["Sender Custom Fields"]?.length > 0
            ? `
            ${invoiceData["Sender Custom Fields"]
              .map(
                (item) => `
                ${
                  item["fieldName"] && item["fieldValue"]
                    ? `
                    <div style="display: flex; align-items: center;">
                      <p class="details-data custom-field w-50">${item["fieldName"]}:</p>
                      <p class="details-data w-50"> ${item["fieldValue"]}</p>
                    </div>
                  `
                    : ""
                }
              `
              )
              .join("")}
              `
            : ""
        }
      </div>
      <div class="data-limit">
        <p class="details-title">TO</p>
        ${
          invoiceData["Receiver's Name"]
            ? `<p class="details-data">${invoiceData["Receiver's Name"]}</p>`
            : ""
        }
        
        ${
          invoiceData["Receiver's Address"] || invoiceData["Receiver's City"]
            ? `<p class="details-data">
            ${
              invoiceData["Receiver's Address"]
                ? `${invoiceData["Receiver's Address"]}, `
                : ""
            }
            ${invoiceData["Receiver's City"] || ""}
          </p>`
            : ""
        }
        
        ${
          invoiceData["Receiver's Zipcode"] || invoiceData["Receiver's State"]
            ? `<p class="details-data">
            ${
              invoiceData["Receiver's State"]
                ? `${invoiceData["Receiver's State"]}, `
                : ""
            }
            ${
              invoiceData["Receiver's Zipcode"]
                ? `${invoiceData["Receiver's Zipcode"]}`
                : ""
            }
          </p>`
            : ""
        }
      
        ${
          invoiceData["Receiver's Contact No"]
            ? `<p class="details-data">+91-${invoiceData["Receiver's Contact No"]}</p>`
            : ""
        }
        ${
          invoiceData["Receiver's Email"]
            ? `<p class="details-data">${invoiceData["Receiver's Email"]}</p>`
            : ""
        }
        ${
          invoiceData["Receiver's Tax No"]
            ? `<p class="details-data">GST No: ${invoiceData["Receiver's Tax No"]}</p>`
            : ""
        }
        ${
          invoiceData["Receiver's PAN No"]
            ? `<p class="details-data">PAN No: ${invoiceData["Receiver's PAN No"]}</p>`
            : ""
        }
        ${
          invoiceData["Client Custom Fields"]?.length > 0
            ? `
      
            ${invoiceData["Client Custom Fields"]
              .map(
                (item) => `
                ${
                  item["fieldName"] && item["fieldValue"]
                    ? `
                    <div style="display: flex; align-items: center;">
                      <p class="details-data custom-field w-50">${item["fieldName"]}:</p>
                      <p class="details-data w-50"> ${item["fieldValue"]}</p>
                    </div>
                  `
                    : ""
                }
              `
              )
              .join("")}
              `
            : ""
        }
      </div>
      <div class="invoice-number ">
      <div class="grid-container">
          <p class="details-title" >INVOICE # </p>
          <p class="details-data table-data-limit">${
            invoiceData["Invoice No."]
          }</p>
          <p class="details-title">INVOICE DATE</p>
          <p class="details-data">${invoiceData["Invoice Issue Date"]}</p>
          ${
            invoiceData["Invoice Due Date"]
              ? `<p class="details-title">DUE DATE </p>
                <p class="details-data">${invoiceData["Invoice Due Date"]}</p>`
              : ""
          }
          ${
            invoiceData["newFields"]?.length > 0
              ? `
              ${invoiceData["newFields"]
                .map(
                  (item) =>
                    `${
                      item["fieldName"] && item["fieldValue"]
                        ? `
                    <p class="details-title table-data-limit">${item["fieldName"]}:</p>
                    <p class="details-data table-data-limit">${item["fieldValue"]}</p>
                    `
                        : ""
                    } `
                )
                .join("")}
              `
              : ""
          }
        </div>
      </div>
  </div>
    <table class="table">
      <thead>
        <tr>
          <th class="align-left w-10px">No.</th>
          <th class="align-left w-25">Item Name</th>
          <th class="align-right">Price</th>
          <th class="align-right">QTY</th>
          ${
            (invoiceData.itemData["taxPercentage"] <= 0 &&
              invoiceData.itemData["discount"] > 0) ||
            (invoiceData.itemData["taxPercentage"] > 0 &&
              !invoiceData.itemData["discount"] > 0)
              ? `<th class="align-right">Amount</th>`
              : ""
          }
          ${
            invoiceData.itemData["discount"] > 0
              ? `<th class="align-right">Discount</th>`
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0 &&
            invoiceData.itemData["discount"] > 0
              ? `<th class="align-right">Net Price</th>
              `
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0
              ? `<th class="align-right">GST %</th>`
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0 &&
            !invoiceData.itemData["discount"] > 0
              ? `<th class="align-right">
              <span class="currency-symbol-cls">GST ${rupeeIcon()}</span>
            </th>
            `
              : ""
          }  
          <th class="align-right">Total</th>
        </tr>
      </thead>
      <tbody>
      ${invoiceData["Items"]
        .map(
          (item, index) => `
        <tr>
          <td class="align-left v-align-top">${index + 1}</td>
          <td class="align-left data-limit">
            ${item["name"]}
            </br>
            ${
              isDescriptionAvailable && item["description"]
                ? `<p class="description">${item["description"]}</p>`
                : ""
            }
          </td>
          <td class="align-right table-data-limit">
              <span class="currency-symbol-cls">${rupeeIcon()}
              ${item["price"]}</span>
          </td>
          <td class="align-right table-data-limit">${item["quantity"]}</td>
          ${
            (invoiceData.itemData["taxPercentage"] <= 0 &&
              invoiceData.itemData["discount"] > 0) ||
            (invoiceData.itemData["taxPercentage"] > 0 &&
              !invoiceData.itemData["discount"] > 0)
              ? `<td class="align-right table-data-limit">
              <span class="currency-symbol-cls">${rupeeIcon()}
              ${item["amount"]}</span></td>`
              : ""
          }
          ${
            invoiceData.itemData["discount"] > 0 > 0
              ? `<td class="align-right table-data-limit">
            ${item["discountPercentage"] || 0}%
          </td>`
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0 &&
            invoiceData.itemData["discount"] > 0
              ? `<td class="align-right table-data-limit">
              <span class="currency-symbol-cls">${rupeeIcon()}
              ${item["afterDiscount"]}</span>
            </td>`
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0
              ? `<td class="align-right table-data-limit">
              ${item["taxPercentage"] || 0}%</th>`
              : ""
          }
          ${
            invoiceData.itemData["taxPercentage"] > 0 &&
            !invoiceData.itemData["discount"] > 0
              ? `<td class="align-right table-data-limit">
              <span class="currency-symbol-cls">${rupeeIcon()}
              ${item["taxAmount"]}</span>
            </td>`
              : ""
          }
          <td class="align-right table-data-limit">
            <span class="currency-symbol-cls">${rupeeIcon()}
            ${item["total"]}</span>
          </td>
        </tr>
        `
        )
        .join("")}
      </tbody>
    </table>
    <div class="totals">
        <div class="grid-container">
              ${
                invoiceData.itemData["taxPercentage"] > 0 ||
                invoiceData.itemData["discount"] > 0
                  ? `
              <p class="details-data">Subtotal</p>
              <p class="details-data data-limit">
                <span class="currency-symbol-cls">${rupeeIcon()}
                ${invoiceData.itemData["subTotal"]}</span>
              </p>
              ${
                invoiceData.itemData["discount"] > 0
                  ? `
                  <p class="details-data">Discount</p>
                  <p class="details-data data-limit">
                    <span class="currency-symbol-cls">${rupeeIcon()}
                    ${invoiceData.itemData["discount"]}</span>
                  </p> `
                  : ""
              }
              ${
                invoiceData.itemData["discount"] > 0 &&
                invoiceData.itemData["taxPercentage"] > 0
                  ? `<p class="details-data">Net Prize</p>
                <p class="details-data data-limit">
                  <span class="currency-symbol-cls">${rupeeIcon()}
                  ${invoiceData.itemData["afterDiscountAmount"]}</span>
                </p> `
                  : ""
              }
              ${
                invoiceData.itemData["taxPercentage"] > 0
                  ? invoiceData["Sender's Tax Type"] === "IGST"
                    ? `<p class="details-data">
                  ${invoiceData["Sender's Tax Type"]}
              </p>
              <p class="details-data data-limit">
                <span class="currency-symbol-cls">${rupeeIcon()}
                ${invoiceData.itemData["taxAmount"]}</span>
              </p>`
                    : `
              <p class="details-data">CGST</p>
              <p class="details-data data-limit">
                <span class="currency-symbol-cls">${rupeeIcon()}
                ${invoiceData.itemData["taxAmount"] / 2}</span>
              </p>
              <p class="details-data">SGST</p>
              <p class="details-data data-limit">
              <span class="currency-symbol-cls">${rupeeIcon()}
              ${invoiceData.itemData["taxAmount"] / 2}</span></p>`
                  : ""
              }`
                  : ""
              }
              ${AdvancePaidAmount}
          </div>
    </div>
    <div class="result-container">
     <p class="details-title result">TOTAL</p>
     <p class="details-title result">
        <span class="currency-symbol-cls">${rupeeIcon()}
        ${invoiceData.itemData["total"]}</span>
      </p>
      </div>
    ${remarksUI}
    <div class="terms">
    ${
      bankDetailsAvailable
        ? `
      <h3 class="details-title">Bank Details</h3>
      <div class="grid-container">
          ${
            invoiceData["Bank Name"]
              ? `
                    <p class="details-data">Bank Name:</p>
                    <p class="details-data data-limit">${invoiceData["Bank Name"]}</p>
              `
              : ""
          }
              ${
                invoiceData["Account No"]
                  ? `
                    <p class="details-data">A/c No:</p>
                    <p class="details-data data-limit">${invoiceData["Account No"]}</p>
              `
                  : ""
              }
              ${
                invoiceData["Account Holder Name"]
                  ? `
                    <p class="details-data">A/c Holder Name:</p>
                    <p class="details-data data-limit">${invoiceData["Account Holder Name"]}</p>
              `
                  : ""
              }
              ${
                invoiceData["IFSC Code"]
                  ? `
                    <p class="details-data">IFSC Code:</p>
                    <p class="details-data data-limit">${invoiceData["IFSC Code"]}</p>
              `
                  : ""
              }
              ${
                invoiceData["Account Type"]
                  ? `
                    <p class="details-data">A/c Type:</p>
                    <p class="details-data">${invoiceData["Account Type"]}</p>
              `
                  : ""
              }
              ${
                invoiceData["Bank Address"]
                  ? `
                    <p class="details-data">Bank Address:</p>
                    <p class="details-data data-limit">${invoiceData["Bank Address"]}</p>
              `
                  : ""
              }
        </div>
        `
        : ""
    }
      </div>
    </div>
    </main>
  </div>
</body>
</html>
        `;
}
