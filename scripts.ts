document.addEventListener("DOMContentLoaded", () => {
  const transactionForm = document.getElementById(
    "transactionForm"
  ) as HTMLFormElement;

  transactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const amount = (
      document.getElementById("transactionText") as HTMLInputElement
    ).value;
    const type = (
      document.getElementById("transactionType") as HTMLSelectElement
    ).value;
    const description = (
      document.getElementById("transactionDescription") as HTMLInputElement
    ).value;

    const response = await fetch("/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, type, description }),
    });

    const data = await response.json();

    // Handle the response, update the UI, etc.
  });
});
