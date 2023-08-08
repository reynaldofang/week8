// Class Transaction merepresentasikan sebuah transaksi keuangan dengan properti amount, type, dan description.
class Transaction {
  amount: number; // Jumlah uang dari transaksi
  type: string; // Jenis transaksi ("income" untuk pendapatan, "expense" untuk pengeluaran)
  description: string; // Deskripsi transaksi

  // Constructor untuk membuat objek Transaction baru.
  constructor(amount: number, type: string, description: string) {
    this.amount = amount;
    this.type = type;
    this.description = description;
  }
}

// Class FinancialTracker digunakan untuk mengelola daftar transaksi dan menghitung saldo keuangan.
class FinancialTracker {
  transactions: Transaction[]; // Daftar transaksi
  balance: number; // Saldo keuangan

  // Constructor untuk membuat objek FinancialTracker baru.
  constructor() {
    this.transactions = [];
    this.balance = 0;
  }

  // Fungsi untuk menambahkan transaksi baru ke dalam daftar transaksi
  addTransaction(amount: number, type: string, description: string) {
    // Validasi input yang masuk, dan jika tidak valid, tampilkan pesan peringatan
    if (!amount || isNaN(amount)) {
      alert("Masukkan jumlah transaksi dengan benar.");
      return;
    }

    if (!description.trim()) {
      alert("Deskripsi transaksi tidak boleh kosong.");
      return;
    }

    // Buat objek transaksi baru dan tambahkan ke daftar transaksi
    const transaction = new Transaction(amount, type, description);
    this.transactions.push(transaction);

    // Perbarui saldo berdasarkan jenis transaksi (pendapatan atau pengeluaran)
    if (type === "income") {
      this.balance += amount;
    } else if (type === "expense") {
      this.balance -= amount;
    }

    // Perbarui tampilan saldo dan daftar transaksi di halaman
    this.updateBalance();
    this.updateTransactionList();
  }

  // Fungsi untuk memperbarui tampilan saldo di halaman dan menyimpannya di local storage
  updateBalance() {
    const balanceAmount = document.getElementById("balanceAmount");
    if (balanceAmount) {
      balanceAmount.textContent = this.formatToRupiah(this.balance);
    }

    localStorage.setItem("balance", this.balance.toString());
  }

  // Fungsi utilitas untuk memformat angka menjadi format mata uang Rupiah
  formatToRupiah(amount: number): string {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return formatter.format(amount);
  }

  // Fungsi untuk memperbarui daftar transaksi di halaman
  updateTransactionList() {
    const transactionList = document.getElementById("transactionList");
    const noTransactionMessage = document.getElementById(
      "noTransactionMessage"
    ) as HTMLDivElement;

    if (transactionList && noTransactionMessage) {
      transactionList.innerHTML = "";

      // Jika tidak ada transaksi, tampilkan pesan bahwa tidak ada transaksi
      if (this.transactions.length === 0) {
        noTransactionMessage.style.display = "block"; // Tampilkan pesan
      } else {
        noTransactionMessage.style.display = "none"; // Sembunyikan pesan
        this.transactions.forEach((transaction) => {
          const listItem = document.createElement("li");
          listItem.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center"
          );
          listItem.textContent = `${
            transaction.type === "income" ? "Pemasukan" : "Pengeluaran"
          }: ${this.formatToRupiah(transaction.amount)} - ${
            transaction.description
          }`;
          transactionList.appendChild(listItem);
        });
      }
    }
  }

  // Fungsi untuk menyimpan daftar transaksi dan saldo ke dalam local storage
  saveTransactionsToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
    localStorage.setItem("balance", this.balance.toString());
  }

  // Fungsi untuk memuat daftar transaksi dan saldo dari local storage saat halaman dimuat
  loadTransactionsFromLocalStorage() {
    const storedTransactions = localStorage.getItem("transactions");
    const storedBalance = localStorage.getItem("balance");

    if (storedTransactions) {
      this.transactions = JSON.parse(storedTransactions);
    } else {
      this.transactions = [];
    }

    if (storedBalance) {
      this.balance = parseFloat(storedBalance);
    } else {
      this.balance = 0;
    }
  }
}

// Membuat objek FinancialTracker untuk mengelola data transaksi
const tracker = new FinancialTracker();

// Fungsi untuk menghapus semua data dari local storage
function clearLocalStorage() {
  localStorage.removeItem("transactions");
  localStorage.removeItem("balance");
}

// Event listener yang akan dijalankan saat halaman dimuat
window.addEventListener("load", () => {
  tracker.loadTransactionsFromLocalStorage();
  tracker.updateBalance();
  tracker.updateTransactionList();
});

// Mendapatkan referensi ke formulir transaksi dari elemen HTML
const transactionForm = document.getElementById(
  "transactionForm"
) as HTMLFormElement;
if (transactionForm) {
  // Event listener untuk menangani saat formulir transaksi di-submit
  transactionForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Ambil nilai dari input formulir transaksi
    const transactionText = document.getElementById(
      "transactionText"
    ) as HTMLInputElement;
    const transactionType = document.getElementById(
      "transactionType"
    ) as HTMLSelectElement;
    const transactionDescription = document.getElementById(
      "transactionDescription"
    ) as HTMLInputElement;

    const amount = transactionText.value.trim(); // Dapatkan nilai input dan hapus spasi awal/akhir

    // Gunakan regular expression untuk memeriksa apakah input hanya berisi angka
    const numericPattern = /^\d+$/;
    if (!numericPattern.test(amount)) {
      alert("Jumlah transaksi harus berupa angka.");
      return;
    }

    const parseAmount = parseFloat(amount);
    const type = transactionType.value;
    const description = transactionDescription.value;

    // Validasi input yang masuk, dan jika tidak valid, tampilkan pesan peringatan
    if (!amount || isNaN(parseAmount)) {
      alert("Masukkan jumlah transaksi dengan benar.");
      return;
    }

    if (!type) {
      alert("Pilih jenis transaksi.");
      return;
    }

    if (!description.trim()) {
      alert("Deskripsi transaksi tidak boleh kosong.");
      return;
    }

    // Tambahkan transaksi baru dan perbarui tampilan serta local storage
    tracker.addTransaction(parseAmount, type, description);
    transactionText.value = "";
    transactionDescription.value = "";

    tracker.saveTransactionsToLocalStorage();
    tracker.updateTransactionList();
  });
}

// Mendapatkan referensi ke tombol "Clear Local Storage" dari elemen HTML
const clearLocalStorageButton = document.getElementById(
  "clearLocalStorageButton"
);
if (clearLocalStorageButton) {
  // Event listener untuk menghapus semua data dari local storage saat tombol "Clear Local Storage" diklik
  clearLocalStorageButton.addEventListener("click", () => {
    // Tampilkan konfirmasi pop-up
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus semua data?"
    );

    if (isConfirmed) {
      // Hapus semua data, perbarui tampilan dan local storage
      tracker.transactions = [];
      tracker.balance = 0;

      clearLocalStorage();

      tracker.updateBalance();
      tracker.updateTransactionList();
    }
  });
}

// Perbarui daftar transaksi saat halaman dimuat
tracker.updateTransactionList();
