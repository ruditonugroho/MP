//product.html
// Fungsi untuk menambahkan produk ke keranjang belanja
function addToCart(productId) {
    // Ambil jumlah produk dari input berdasarkan ID produk
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
    // Ambil ukuran produk dari input berdasarkan ID produk
    const size = document.getElementById(`size-${productId}`).value;
    // Tentukan nama produk berdasarkan ID-nya
    const productName = productId === 1 ? "Home Jersey" : "Away Jersey";
    // Tetapkan harga produk (dalam rupiah)
    const price = 300000;
    // Ambil data keranjang dari localStorage, atau buat array kosong jika belum ada
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Cek apakah produk dengan ID dan ukuran yang sama sudah ada di keranjang
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    // Jika sudah ada, tambahkan jumlahnya
    if (existingItem) {
        existingItem.quantity += quantity;
    // Jika belum ada, tambahkan produk baru ke dalam array keranjang
    } else {
        cart.push({
            id: productId,
            name: productName,
            size: size,
            quantity: quantity,
            price: price
        });
    }

    // Simpan kembali data keranjang yang sudah diperbarui ke localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    // Tampilkan alert kepada pengguna bahwa produk telah ditambahkan
    alert(`${productName} (Size ${size}) added to your shopping cart!`);
}

//cart.html
// Fungsi untuk memuat data keranjang dari localStorage dan menampilkannya ke halaman
function loadCart() {
    // Ambil data keranjang dari localStorage, jika tidak ada gunakan array kosong
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Jika keranjang kosong, tampilkan pesan
    if (cart.length === 0) {
      document.getElementById("cart-container").innerHTML = "<p>Your shopping cart is empty</p>";
      return;
    }

    let total = 0;
    let tableHTML = `
      <table class="table table-bordered align-middle">
        <thead class="table-light">
          <tr>
            <th>Product</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
    `;

    // Iterasi setiap item dalam keranjang
    cart.forEach((item, index) => {
        //Hitung subtotal
        const subtotal = item.quantity * item.price;
        //Hitung total
        total += subtotal;
        // Tambahkan baris tabel untuk setiap produk
        tableHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.size}</td>
                <td>
                    <div class="quantity-control">
                        <!-- Tombol untuk mengurangi jumlah -->
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">−</button>
                        <span class="quantity-number">${item.quantity}</span>
                        <!-- Tombol untuk menambah jumlah -->
                        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </td>
                <td>Rp ${item.price.toLocaleString()}</td>
                <td>Rp ${subtotal.toLocaleString()}</td>
            </tr>
        `;
    });
    
    tableHTML += `
        </tbody>
        <tfoot>
            <tr>
                <th colspan="4" class="text-end">Total</th>
                <th>Rp ${total.toLocaleString()}</th>
            </tr>
        </tfoot>
        </table>
        <div class="text-end">
            <button class="btn btn-success" onclick="checkoutCart()">Check Out</button>
        </div>
    `;
    // Masukkan HTML ke dalam kontainer
    document.getElementById("cart-container").innerHTML = tableHTML;
}
// Fungsi untuk memperbarui jumlah barang pada keranjang
function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Cek apakah item pada indeks tersebut ada
    if (cart[index]) {
        cart[index].quantity += change;
        // Hapus item jika jumlahnya kurang dari atau sama dengan 0
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        // Simpan kembali ke localStorage dan muat ulang tampilan
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }
}

// Fungsi untuk menangani proses checkout
function checkoutCart() {
    // Tampilkan konfirmasi checkout
    if (confirm("Proceed to checkout?")) {
        alert("The payment process will be continued via email."); // Notifikasi sukses
        localStorage.removeItem("cart"); // Hapus keranjang dari localStorage
        loadCart(); // Muat ulang tampilan keranjang
    }
  }

// Jalankan loadCart saat halaman dimuat
window.onload = loadCart;