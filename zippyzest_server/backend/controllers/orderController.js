const Cart = require('../models/cart')
const Order = require('../models/order')
const Product = require('../models/product')
const Seller = require('../models/seller')
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
// const createOrder = async (req, res) => {
//     try {
//       const userId = req.user.id;
//       const { shippingAddress, paymentMethod, isCOD } = req.body;
//       console.log(req.body);
  
//       // Fetch the user's cart
//       const cart = await Cart.findOne({ userId }).populate('cartitems');
  
//       if (!cart || cart.cartitems.length === 0) {
//         return res.status(404).send({
//           success: false,
//           message: 'Cart is empty'
//         });
//       }
  
//       // Fetch sellerId for each product in the cartitems
//       const populatedCartItems = await Promise.all(
//         cart.cartitems.map(async (item) => {
//           const product = await Product.findById(item.productId).select('sellerId');
//           return {
//             product: item.productId,
//             quantity: item.quantity,
//             price: item.price,
//             sellerId: product.sellerId, // Get sellerId from the product
//           };
//         })
//       );
  
//       const totalAmount = populatedCartItems.reduce((total, item) => {
//         return total + item.price * item.quantity;
//       }, 0);
  
//       // Create the new order
//       const newOrder = new Order({
//         user: userId,
//         items: populatedCartItems, // Use the populated cart items with sellerId
//         totalAmount,
//         shippingAddress: {
//           addressLine1: shippingAddress.addressLine1,
//           addressLine2: shippingAddress.addressLine2 || '',
//           city: shippingAddress.city,
//           state: shippingAddress.state,
//           postalCode: shippingAddress.postalCode,
//           country: shippingAddress.country
//         },
//         paymentMethod : isCOD ? 'Cash On Delivery' : paymentMethod,
//         isCOD: isCOD || false,
//         paymentStatus: isCOD ? 'Pending' : 'Completed'
//       });
      
  
//       await newOrder.save();
  
//       // Clear the cart after placing the order
//       cart.cartitems = [];
//       cart.totalPrice = 0;
//       await cart.save();
  
//      if (!isCOD) {
//       const sellerUPIId = 'seller-upi-id@bank'; // Replace with seller's UPI ID
//       const sellerName = 'Seller Name'; // Replace with the seller's name

//       // UPI payment link
//       const upiLink = `upi://pay?pa=${sellerUPIId}&pn=${sellerName}&am=${totalAmount}&cu=INR&tn=Order Payment`;

//       // Generate the QR code
//       const qrCode = await QRCode.toDataURL(upiLink);

//       res.status(201).send({
//         success: true,
//         message: 'Order placed successfully!',
//         order: newOrder,
//         qrCode, // Send the QR code to the frontend
//       });
//     } else {
//       res.status(201).send({
//         success: true,
//         message: 'Order placed successfully!',
//         order: newOrder,
//       });
//     }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send({
//         success: false,
//         message: 'Failed to place the order.'
//       });
//     }
//   };
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod, isCOD } = req.body;

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId }).populate('cartitems');
    if (!cart || cart.cartitems.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Fetch sellerId and sellerName for each product in the cartitems
    const populatedCartItems = await Promise.all(
      cart.cartitems.map(async (item) => {
        const product = await Product.findById(item.productId).select('sellerId productStock productUnit name');
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found.`);
        }

        const seller = await Seller.findById(product.sellerId).select('username');
        if (!seller) {
          throw new Error(`Seller for product ${product.name} not found.`);
        }

        return {
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          sellerId: product.sellerId,
          sellerName: seller.username,
          productStock: product.productStock,
          productUnit: product.productUnit,
          productName: product.name,
        };
      })
    );

    // Check stock availability and update product stock
    await Promise.all(
      populatedCartItems.map(async (item) => {
        if (item.productStock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${item.productName}`);
        }

        const updatedProduct = await Product.findOneAndUpdate(
          { _id: item.product, productStock: { $gte: item.quantity } },
          { $inc: { productStock: -item.quantity } },
          { new: true }
        );

        if (!updatedProduct) {
          throw new Error(`Unable to update stock for product: ${item.productName}`);
        }
      })
    );

    // Calculate the total amount
    const totalAmount = populatedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // Create the new order
    const newOrder = new Order({
      user: userId,
      items: populatedCartItems,
      totalAmount,
      shippingAddress: {
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      paymentMethod: isCOD ? 'Cash On Delivery' : paymentMethod,
      isCOD: isCOD || false,
      paymentStatus: isCOD ? 'Pending' : 'Completed',
    });

    await newOrder.save();

    // Clear the user's cart
    cart.cartitems = [];
    cart.totalPrice = 0;
    await cart.save();

    // Generate a UPI payment link and QR code for online payments
    if (!isCOD) {
      const firstSeller = populatedCartItems[0];
      const upiLink = `upi://pay?pa=${firstSeller.sellerId}@bank&pn=${firstSeller.sellerName}&am=${totalAmount}&cu=INR&tn=Order Payment`;
      const qrCode = await QRCode.toDataURL(upiLink);

      return res.status(201).send({
        success: true,
        message: 'Order placed successfully!',
        order: newOrder,
        qrCode, // Include the QR code for payment
      });
    }

    res.status(201).send({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message || 'Failed to place the order.',
    });
  }
};

 
const  getOrder = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Fetch all orders for the user
      const orders = await Order.find({ user: userId })
        .populate('items.product') // Populate product details if needed
        .populate('items.sellerId', 'name') // Populate seller details if needed
        .exec();
  
      if (!orders || orders.length === 0) {
        return res.status(404).send({
          success: false,
          message: 'No orders found for this user'
        });
      }
      
  
      // Send the fetched orders
      res.status(200).send({
        success: true,
        orders
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: 'Failed to fetch orders'
      });
    }
  };
  
  const Updateorder = async(req,res) => {
    try {
     let orderId = req.query.id;
     
      const { status } = req.body; // New status from the frontend (e.g., "Ready to Ship")
  
      // Find the order by ID
      const order = await Order.findById(orderId);
  console.log(order);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
  
    
      order.status = status;
      await order.save();
  
      res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        order,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order status',
      });
  }}
  const updateBulkOrderStatus = async (req, res) => {
    try {
      const { orderIds, status } = req.body; // orderIds: array of IDs, status: new status
  
      if (!Array.isArray(orderIds) || orderIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No orders provided',
        });
      }
  
      // Find orders and update their status in bulk
      const updatedOrders = await Order.updateMany(
        { _id: { $in: orderIds } }, // Filter: update only the orders whose IDs are in the orderIds array
        { $set: { status: status } }, // Set the new status for the orders
        { multi: true, new: true } // Options: multi allows updating multiple documents
      );
  
      if (!updatedOrders) {
        return res.status(404).json({
          success: false,
          message: 'Orders not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: `Orders status updated to ${status}`,
        updatedOrders,
      });
    } catch (error) {
      console.error('Error updating orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update orders status',
      });
    }
  };
  const pdf = require('html-pdf');
  const imagePath = path.join(__dirname, '../uploads/Zippy zest png.png');
  const nodemailer = require('nodemailer');

// Create a transporter using SendGrid SMTP
const transporter = nodemailer.createTransport({
 service: 'gmail',
  auth: {
    user: process.env.email_name, // This is the literal username 'apikey' for SendGrid
    pass: process.env.email_pass, // Replace with your SendGrid API key
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.error('Error configuring Nodemailer transporter:', error);
  } else {
    console.log('Nodemailer transporter is ready to send emails');
  }
});
  const sendInvoiceEmail = async(toEmail,order,invoicePath) => {
    try {
      const mailOptions = {
        from: process.env.email_name, // Sender address
        to: toEmail, // List of receivers
        subject: `Invoice for Order #${order._id}`, // Subject line
        text: `Hello ${order.user.username},\n\nPlease find attached the invoice for your recent order.\n\nThank you for shopping with us!\n\nBest Regards,\nYour Company Name`, // Plain text body
        html: `<p>Hello ${order.user.username},</p>
               <p>Please find attached the invoice for your recent order.</p>
               <p>Thank you for shopping with us!</p>
               <p>Best Regards,<br>Your Company Name</p>`, // HTML body
        attachments: [
          {
            filename: `invoice_${order._id}.pdf`,
            path: invoicePath, // Path to the invoice PDF
            contentType: 'application/pdf',
          },
        ],
      };
      let info = await transporter.sendMail(mailOptions);
      console.log('Invoice email sent:', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending invoice email:', error);
    return false;
    }
  }
const generateInvoiceHtml = (order) => {
    return `
      <html>
        <head>
          <style>
            .invoice-container {
              width: 800px;
              margin: 0 auto;
              padding: 20px;
              font-family: Arial, sans-serif;
              border: 1px solid #ddd;
              border-radius: 8px;
              background-color: #f9f9f9;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            
            .company-details h2 {
              color: #ff5722;
            }
            
            .invoice-details h3 {
              text-align: center;
            }
            
            .customer-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            
            .order-details table {
              width: 100%;
              border-collapse: collapse;
            }
            
            .order-details table th, .order-details table td {
              padding: 8px;
              text-align: left;
              border: 1px solid #ddd;
            }
            
            .footer {
              margin-top: 20px;
              text-align: right;
            }
            
            .total-section p {
              margin: 0;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
           <div class="invoice-container">
          <!-- Header Section -->
          <div class="header">
            <div class="company-details">
              <h2><img src=${imagePath} width="100"/></h2>
              <p>25 RUE DE PONTHIEU, 75008, PARIS 8</p>
            </div>
            <div class="invoice-details">
              <h3>Invoice</h3>
              <p>Invoice No: F-${order._id}</p>
              <p>Date Issued: ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p>BC: 55555555</p>
            </div>
          </div>
  
          <!-- Customer Section -->
          <div class="customer-section">
            <div class="customer-info">
              <h4>Customer</h4>
              <p>${order.user.username || "Customer"}</p>
              <p>Mobile Number : +91${order.user.mobileNumber || "Customer"}</p>
              <p>SIREN: ${order.user.siren} / VAT: ${order.user.vat}</p>
              <p>${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.country}</p>
            </div>
            <div class="delivery-info">
              <h4>Deliver To</h4>
              <p>${order.shippingAddress.addressLine1}</p>
            </div>
          </div>
  
          <!-- Order Details -->
          <div class="order-details">
            <h4>Order Details</h4>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th>Tax</th>
                  <th>Discount</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.product.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price}</td>
                    <td>₹${(item.price * item.quantity)}</td>
                    <td>0%</td>
                    <td>0%</td>
                    <td>₹${((item.price * item.quantity))}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
  
          <!-- Footer Section -->
          <div class="footer">
            <div class="total-section">
              <p>Subtotal: ₹0</p>
              <p>Discount: ₹0</p>
              <p>Total VAT: ₹0</p>
              <p>Total: ${order.totalAmount}</p>
            </div>
          </div>
        </div>
        </body>
      </html>
    `;
};
  
  const generateInvoicePdf = async(order, res) => {
    const html = generateInvoiceHtml(order);
    const options = { format: 'A4' };
    const invoicePath = `./invoices/${order._id}.pdf`;
    pdf.create(html, options).toFile(invoicePath, (err, result) => {
      if (err) {
        return res.status(500).send('Error generating PDF');
      }
      res.sendFile(path.resolve(result.filename));
    });
    if(order.invoiceDownloaded === false){
      const emailSent = await sendInvoiceEmail(order.user.email, order, invoicePath);
      if (emailSent) {
        res.status(200).send({
          success: true,
          message: 'Invoice generated and emailed successfully!',
        });
      } else {
        res.status(500).send({
          success: false,
          message: 'Invoice generated but failed to send email.',
        });
      }
    };
    }
  // const generateInvoice = (order, res) => {
  //   const doc = new PDFDocument({ margin: 50 });
  
  //   // Set the file path for the invoice PDF
  //   const invoicePath = path.join(__dirname, '../invoices', `invoice_${order._id}.pdf`);
  
  //   // Pipe the document to a file
  //   const fileStream = fs.createWriteStream(invoicePath);
  //   doc.pipe(fileStream);
  
  //   // Header
  //   doc
  //     .image('./uploads/Zippy zest  png.png', 50, 45, { width: 50 }) // Add your logo
  //     .fillColor('#444444')
  //     .fontSize(20)
  //     .text('Zippy Zest', 110, 57)
  //     .fontSize(10)
  //     .text('Your Company Address', 200, 65, { align: 'right' })
  //     .text('City, State, ZIP Code', 200, 80, { align: 'right' })
  //     .moveDown();
  
  //   // Invoice Title and Order Details
  //   doc
  //     .fillColor('#000000')
  //     .fontSize(20)
  //     .text('Invoice', { align: 'center' })
  //     .fontSize(12)
  //     .moveDown()
  //     .text(`Order ID: ${order._id}`, { align: 'left' })
  //     .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'left' })
  //     .moveDown();
  
  //   // Customer Information
  //   doc
  //     .fontSize(14)
  //     .text('Bill To:', 50, 200)
  //     .fontSize(12)
  //     .text(`${order.user?.username || "user"}`, { align: 'left' })
  //     .text(`${order.user?.mobileNumber || "mobilenumber"}`, { align: 'left' })
  //     .text(`${order.user?.email || "email"}`, { align: 'left' })
  //     .text(`${order.shippingAddress.addressLine1}`, { align: 'left' })
  //     .moveDown();
  
  //   // Table headers
  //   const tableTop = 300;
  //   const itemHeaders = ["Product", "Quantity", "Unit Price", "Total Price"];
  //   const headerXPositions = [50, 200, 300, 400];
    
  //   doc.fontSize(12);
  //   itemHeaders.forEach((header, index) => {
  //     doc.text(header, headerXPositions[index], tableTop, { bold: true });
  //   });
  
  //   // Table rows for items
  //   let itemPosition = tableTop + 25;
  //   order.items.forEach(item => {
  //     doc.text(item.product.name, 50, itemPosition)
  //       .text(item.quantity, 200, itemPosition)
  //       .text(`Rs. ${item.product.price}`, 300, itemPosition)
  //       .text(`Rs. ${item.price}`, 400, itemPosition);
  
  //     itemPosition += 25;
  //   });
  
  //   // Total price
  //   doc.moveDown().fontSize(14).text(`Total Amount: Rs. ${order.totalAmount}`, { align: 'right' });
  
  //   // Footer
  //   doc.fontSize(10).text('Thank you for your business!', 50, 700, { align: 'center', width: 500 });
  
  //   // Finalize the PDF and end the stream
  //   doc.end();
  //   fileStream.on('finish', () => {
  //     // Send the file as a response
  //     res.download(invoicePath, `invoice_${order._id}.pdf`, (err) => {
  //       if (err) {
  //         console.error('Error downloading the invoice:', err);
  //         res.status(500).send('Error downloading the file');
  //       }
  //     });
  //   });

  //   // Handle errors in the file stream
  //   fileStream.on('error', (error) => {
  //     console.error('Error writing the PDF file:', error);
  //     res.status(500).send('Error generating the PDF');
  //   });
 
  
  //   // Send the PDF file as a response
  //   // res.download(invoicePath, `invoice_${order._id}.pdf`, (err) => {
  //   //   if (err) {
  //   //     console.error('Error downloading the invoice:', err);
  //   //   }
  //   // });
  // };

  const genrateinvoices = async(req,res) => {
    try {
      const orderId = req.query.id;
      // Fetch order details from the database
      const order = await Order.findById(orderId)
      .populate('items.product') // Populate product details
      .populate('items.sellerId') // Populate seller details
      .populate('user'); // Optionally populate user details
      // console.log(order);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Generate the invoice PDF
      generateInvoicePdf(order, res);
      order.invoiceDownloaded = true;
     await order.save();
    } catch (error) {
      console.log(error);
      return false
    }
  }
  const showstatus = async(req,res) => {
    try {
      const orderId = req.query.id;
      const order = await Order.findById(orderId)
      if(order.invoiceDownloaded){
        return res.status(200).send({
          success : true,
          orderIds : order._id
        })
      }
    } catch (error) {
      console.log(error);
      return false
    }
  }
module.exports = {
    createOrder,getOrder,Updateorder,updateBulkOrderStatus,genrateinvoices,showstatus
}