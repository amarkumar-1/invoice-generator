export default function generateHTMLTPL0010(invoiceData) {
  // Initialize the sub-amount
  let subAmount = 0;
  let totalAmount = 0;
  let taxAmount = 0;
  let isDescriptionAvailable = false;

  // Calculate the sub-amount by summing item prices
  invoiceData?.Items?.forEach((item) => {
    // Convert item price to a number
    // subAmount += parseFloat(item["price"]) * parseFloat(item["quantity"]) || 0;
    subAmount += +item.amount || 0;
    totalAmount += +item.total || 0;
    taxAmount += +item.taxAmount || 0;

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

  // Retrieve tax percentage from invoice data
  const taxPercentage = (taxAmount / subAmount) * 100 || 0;

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
      max-width: 220px;
      word-wrap: break-word;
    }

    .table-data-limit{
      max-width: 100px;
      word-wrap: break-word;
    }
    .custom-field{
      display: unset !important;
      font-weight: 600;
    }

    .custom-field-value{
      display: unset !important;
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
          invoiceData["Sender's Zipcode"] ||
          invoiceData["Sender's Address"] ||
          invoiceData["Sender's City"]
            ? `<p class="details-data">
          ${
            invoiceData["Sender's Zipcode"]
              ? `${invoiceData["Sender's Zipcode"]}, `
              : ""
          }
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
          invoiceData["Sender's State"]
            ? `<p class="details-data">
          ${
            invoiceData["Sender's State"]
              ? `${invoiceData["Sender's State"]}, `
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
                      <p class="details-data custom-field">${item["fieldName"]}:</p><p class="details-data custom-field-value"> ${item["fieldValue"]}</p><br>
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
          invoiceData["Receiver's Zipcode"] ||
          invoiceData["Receiver's Address"] ||
          invoiceData["Receiver's City"]
            ? `<p class="details-data">
            ${
              invoiceData["Receiver's Zipcode"]
                ? `${invoiceData["Receiver's Zipcode"]}, `
                : ""
            }
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
          invoiceData["Receiver's State"]
            ? `<p class="details-data">
            ${
              invoiceData["Receiver's State"]
                ? `${invoiceData["Receiver's State"]}, `
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
                      <p class="details-data custom-field">${item["fieldName"]}:</p><p class="details-data custom-field-value"> ${item["fieldValue"]}</p><br>
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
          <p class="details-title align-left" >INVOICE # </p>
          <p class="details-data align-right table-data-limit">${
            invoiceData["Invoice No."]
          }</p>
          <p class="details-title align-left">INVOICE DATE</p>
          <p class="details-data align-right">${
            invoiceData["Invoice Issue Date"]
          }</p>
          ${
            invoiceData["Invoice Due Date"]
              ? `<p class="details-title align-left">DUE DATE </p>
                <p class="details-data align-right">${invoiceData["Invoice Due Date"]}</p>`
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
                    <p class="details-title align-left table-data-limit">${item["fieldName"]}:</p>
                    <p class="details-data align-right table-data-limit">${item["fieldValue"]}</p>
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
          <th class="align-right">Amount</th>
          <th class="align-right">Tax %</th>
          <th class="align-right">Tax ${currencySymbol(
            invoiceData["Currency"]
          )}</th>
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
              ${currencySymbol(invoiceData["Currency"])}
              ${item["price"]}
          </td>
          <td class="align-right table-data-limit">${item["quantity"]}</td>
          <td class="align-right table-data-limit">
            ${currencySymbol(invoiceData["Currency"])}
            ${item["price"] * item["quantity"]}
          </td>
          <td class="align-right table-data-limit">
            ${item["taxPercentage"]}%
          </td>
          <td class="align-right table-data-limit">
            ${currencySymbol(invoiceData["Currency"])}
            ${(
              item["price"] *
              item["quantity"] *
              (item["taxPercentage"] / 100)
            ).toFixed(1)}
          </td>
          <td class="align-right table-data-limit">
            ${currencySymbol(invoiceData["Currency"])}
            ${
              item["price"] * item["quantity"] +
              item["price"] * item["quantity"] * (item["taxPercentage"] / 100)
            }
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
          taxPercentage > 0
            ? `
          <p class="details-data">Subtotal</p>
          <p class="details-data">${currencySymbol(
            invoiceData["Currency"]
          )}${subAmount.toFixed(1)}</p>
          ${
            invoiceData["Sender's Tax Type"] === "IGST"
              ? `
          <p class="details-data">${
            invoiceData["Sender's Tax Type"]
          } (${taxPercentage.toFixed(1)}%)</p>
          <p class="details-data">${currencySymbol(
            invoiceData["Currency"]
          )}${taxAmount.toFixed(1)}</p>
          `
              : `
          <p class="details-data">CGST(${(taxPercentage / 2).toFixed(
            1
          )}%)</p>
          <p class="details-data">${currencySymbol(
            invoiceData["Currency"]
          )}${(taxAmount / 2).toFixed(1)}</p>
          <p class="details-data">SGST(${(taxPercentage / 2).toFixed(
            1
          )}%)</p>
          <p class="details-data">${currencySymbol(
            invoiceData["Currency"]
          )}${(taxAmount / 2).toFixed(1)}</p>
          `
          } `
            : ""
        }
      </div>
    </div>
    <div class="result-container">
     <p class="details-title result">TOTAL</p>
     <p class="details-title result">
                ${currencySymbol(invoiceData["Currency"])}
                ${totalAmount.toFixed(1)}
              </p>
    </div>
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
