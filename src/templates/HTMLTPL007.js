export default function generateHTMLTPL007(invoiceData) {
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

  const currencySymbol = (currency) => {
    const currencySymbols = {
      USD: "$", // US Dollar
      EUR: "€", // Euro
      GBP: "£", // British Pound
      JPY: "¥", // Japanese Yen
      AUD: "A$", // Australian Dollar
      CAD: "C$", // Canadian Dollar
      INR: "₹", // Indian Rupee
      CNY: "¥", // Chinese Yuan
    };

    const symbol = currencySymbols[currency] || "INR"; // Default to empty if currency not found
    return symbol;
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
            <span class="currency-symbol-cls">${currencySymbol(
              invoiceData["Currency"]
            )}</span>${Number(invoiceData["Paid Amount"]).toFixed(2)}</p>`
      : "";

  const bankDetailsAvailable =
    invoiceData["Bank"] ||
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
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <title>Invoice</title> 
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #fff !important;
    }
      
    .invoice-container {
      font-family: "Bebas Neue", sans-serif !important;
      font-weight: 400;
      font-style: normal;
    }

    p{
      margin: 0;
      padding: 0;
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

    .invoice-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      background: white; 
      color: white !important;
      z-index: 1;
      padding: 32px 48px;
      height: 270px;
    }

    .invoice-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #004a7e;
      z-index: -1; 
      clip-path: polygon(0 0, 100% 0, 100% 60%, 0% 100%);
    }

    .invoice-header::after {
      content: '';
      position: absolute;
      bottom: 10px;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      z-index: -1; 
      clip-path: polygon(0 96%, 100% 56%, 100% 60%, 0% 100%);
    }

    .invoice-header h1 {
      font-size: 6rem;
      line-height: unset;
      letter-spacing: unset;
      margin: 0;
      color: #fff !important;
    }

    .invoice-header figure {
      margin: 0;
      padding: 0;
      height: 100px;
    }

    .invoice-header p{
      display: block;
      color: #fff !important;
    }

    .details {
      display: flex;
      justify-content: space-between;
      padding: 0 4em;
      gap:10px;
      margin-top: 20px;
    }

    .data-limit{
      max-width: 230px;
      word-wrap: break-word;
    }

    .table-data-limit{
      max-width: 80px;
      word-wrap: break-word;
    }

    .details-title{
      font-size: 24px;
      font-weight: 500;
      color: #5983af !important;
      line-height: unset;
      letter-spacing: unset;
    }

    .details-data{
      font-family: "Urbanist", sans-serif;
      font-optical-sizing: auto;
      font-weight: 400;
      font-style: normal;
      font-size: 16px;
      color: #000 !important;
      line-height: unset;
      letter-spacing: unset;
    }

    .custom-field{
      font-weight: 600;
    }
    
    .invoice-number .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      align-items: center;
    } 

    .table-container{
      padding: 0 4em;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .table th {
      font-size: 24px;
      font-weight: 500;
      color: #fff !important;
      padding: 0 0.4em;
      background: #5983af;
    }

    .table td {
      font-family: "Urbanist", sans-serif;
      font-optical-sizing: auto;
      font-weight: 400;
      font-style: normal;
      font-size: 18px;
      color: #000 !important;
      padding: 10px;
    }

    .table td .description {
      color: #555555 !important;
      font-size: 16px;  
    }

    .totals {
      width: 100%;
      margin-bottom: 5px;
      text-align: right;
    }
    
    .totals .grid-container {
      display: grid;
      grid-template-columns: 4fr 1fr;
      margin: 0 4em;
      align-items: center;
    }
    
    .totals p {
      padding: 10px;
    }

    .totals .result {
      font-size: 2em;
      margin-top: 0.5em; 
      color: #5983af !important;
    }

    .notes{
      padding: 0 4em;
    }

    .terms {
      position: relative;
      z-index: 0;
      padding: 32px 48px;
      margin-top: 40px;
      font-size: 12px;
      text-align: end;
      min-height: 270px;
    }

    .terms::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #004a7e;
      z-index: -1; 
      clip-path: polygon(0 60%, 100% 0, 100% 100%, 0% 100%);
    }

    .terms::after {
      content: '';
      position: absolute;
      top: 10px;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      z-index: -1; 
      clip-path: polygon(0 60%, 100% 0, 100% 3%, 0 63%);
    }

    .terms .grid-container {
      display: grid;
      grid-template-columns: 4fr 1fr;
      gap: 10px;
      align-items: center;
    }

    .terms h3 {
      margin-top: 1.2em;
      margin-bottom: 10px;
      color: #fff !important;
    }

    .terms p {
      color: #fff !important;
    }

    @media print {
      .invoice-header{
        height: 180px;
      }
      .invoice-header h1 {
        font-size: 4.5em;
      }
      .table th {
        font-size: 20px
      }
     
      .table td {
        font-size: 14px
      }

     .table td .description {
        font-size: 12px;  
      }

      .details{
        line-height: 20px;
      }

      .details-title{
        font-size: 20px;
      }

      .details-data{
        font-size: 14px;
      }

      .terms{
        min-height: 200px;
        page-break-inside: avoid;
      }

      .terms .grid-container {
        grid-template-columns: 3fr 1fr;
        gap: 8px;
      }

      @page {
          margin: 0.5cm;
      }

      .currency-symbol-cls {
        font-size: 18px;
      }
    
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <figure>
         ${
           invoiceData["Logo"]
             ? `<img src=${invoiceData["Logo"]} alt="Company Logo">`
             : ""
         }
      </figure>
      <h1>INVOICE</h1>
    </div>
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
      <div class="invoice-number data-limit">
        <div class="grid-container">
            <p class="details-title">INVOICE # </p>
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
    <div class="table-container">
    <table class="table">
      <thead>
        <tr>
          <th class="align-left w-10px">No.</th>
          <th class="align-left w-25">Item Name</th>
          <th class="align-left">Price</th>
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
              GST <span class="currency-symbol-cls">${currencySymbol(
                invoiceData["Currency"]
              )}</span>
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
          <td class="align-left table-data-limit">
              <span class="currency-symbol-cls">${currencySymbol(
                invoiceData["Currency"]
              )}</span>
              ${item["price"]}
          </td>
          <td class="align-right table-data-limit">${item["quantity"]}</td>
          ${
            (invoiceData.itemData["taxPercentage"] <= 0 &&
              invoiceData.itemData["discount"] > 0) ||
            (invoiceData.itemData["taxPercentage"] > 0 &&
              !invoiceData.itemData["discount"] > 0)
              ? `<td class="align-right table-data-limit">
              <span class="currency-symbol-cls">${currencySymbol(
                invoiceData["Currency"]
              )}</span>
              ${item["amount"]}</td>`
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
              <span class="currency-symbol-cls">${currencySymbol(
                invoiceData["Currency"]
              )}</span>
              ${item["afterDiscount"]}
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
              <span class="currency-symbol-cls">${currencySymbol(
                invoiceData["Currency"]
              )}</span>
              ${item["taxAmount"]}
            </td>`
              : ""
          }
          <td class="align-right table-data-limit">
            <span class="currency-symbol-cls">${currencySymbol(
              invoiceData["Currency"]
            )}</span>
            ${item["total"]}
          </td>
        </tr>
        `
           )
           .join("")}
      </tbody>
    </table>
    </div>
    <div class="totals">
      <div class="grid-container">
              ${
                invoiceData.itemData["taxPercentage"] > 0 ||
                invoiceData.itemData["discount"] > 0
                  ? `
              <p class="details-data">Subtotal</p>
              <p class="details-data data-limit">
                <span class="currency-symbol-cls">${currencySymbol(
                  invoiceData["Currency"]
                )}</span>
                ${invoiceData.itemData["subTotal"]}
              </p>
              ${
                invoiceData.itemData["discount"] > 0
                  ? `
                  <p class="details-data">Discount</p>
                  <p class="details-data data-limit">
                    <span class="currency-symbol-cls">${currencySymbol(
                      invoiceData["Currency"]
                    )}</span>
                    ${invoiceData.itemData["discount"]}
                  </p> `
                  : ""
              }
              ${
                invoiceData.itemData["discount"] > 0 &&
                invoiceData.itemData["taxPercentage"] > 0
                  ? `<p class="details-data">Net Prize</p>
                <p class="details-data data-limit">
                  <span class="currency-symbol-cls">${currencySymbol(
                    invoiceData["Currency"]
                  )}</span>
                  ${invoiceData.itemData["afterDiscountAmount"]}
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
                <span class="currency-symbol-cls">${currencySymbol(
                  invoiceData["Currency"]
                )}</span>
                ${invoiceData.itemData["taxAmount"]}
              </p>`
                    : `
              <p class="details-data">CGST</p>
              <p class="details-data data-limit">
                <span class="currency-symbol-cls">${currencySymbol(
                  invoiceData["Currency"]
                )}</span>
                ${invoiceData.itemData["taxAmount"] / 2}
              </p>
              <p class="details-data">SGST</p>
              <p class="details-data data-limit">
              <span class="currency-symbol-cls">${currencySymbol(
                invoiceData["Currency"]
              )}</span>
              ${invoiceData.itemData["taxAmount"] / 2}</p>`
                  : ""
              }`
                  : ""
              }
            ${AdvancePaidAmount}
              <p class="details-title result">TOTAL</p>
              <p class="details-title result data-limit">
                <span class="currency-symbol-cls">${currencySymbol(
                  invoiceData["Currency"]
                )}</span>
                ${invoiceData.itemData["total"]}
              </p>
      </div>
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
</body>
</html>
        `;
}
