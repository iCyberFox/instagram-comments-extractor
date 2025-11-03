    document.addEventListener('DOMContentLoaded', function() {
      const loadBtn = document.getElementById('loadBtn');
      const saveBtn = document.getElementById('saveBtn');
      const errorMsg = document.getElementById('errorMsg');
      const tableBody = document.querySelector('#commentsTable tbody');
      let comments = [];

      loadBtn.addEventListener('click', async () => {
        // Логін і пароль більше не потрібні
        const postUrl = document.getElementById('postUrl').value.trim();

        if (!postUrl) {
          showError("Заповніть поле: посилання на пост");
          return;
        }

        showMessage("Завантаження коментарів...");
        saveBtn.disabled = true;

        try {
          // Бекенд має бути оновлений для прийому лише postUrl
          const response = await fetch('https://твій-бекенд.up.railway.app/getInstagramComments', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ postUrl }) // Відправляємо лише URL
          });

          if (!response.ok) throw new Error("Помилка при запиті до сервера");

          const data = await response.json();
          if (!data.comments || data.comments.length === 0) {
            showMessage("Коментарі не знайдені або обмежені. Спробуйте інший пост.");
            return;
          }

          comments = data.comments.map((c, i) => ({
            number: i + 1,
            name: c.name,
            text: c.text,
            date: c.date
          }));

          renderTable();
          saveBtn.disabled = false;
        } catch (err) {
          console.error(err);
          showError("Не вдалося отримати коментарі. Переконайтесь, що пост публічний і бекенд працює.");
        }
      });

      function showMessage(msg) {
        errorMsg.textContent = "";
        tableBody.innerHTML = `<tr><td colspan="4" class="status">${msg}</td></tr>`;
      }

      function showError(message) {
        errorMsg.textContent = message;
      }

      function renderTable() {
        if (comments.length === 0) {
          showMessage("Коментарі не знайдені");
          return;
        }

        tableBody.innerHTML = comments.map(comment => `
          <tr>
            <td>${comment.number}</td>
            <td>${comment.name}</td>
            <td>${comment.text}</td>
            <td>${comment.date}</td>
          </tr>
        `).join('');
      }

      saveBtn.addEventListener('click', () => {
        if (comments.length === 0) {
          showError("Немає даних для експорту");
          return;
        }

        const excelData = comments.map(comment => ({
          'Number': comment.number,
          'Name': comment.name,
          'Comment': comment.text,
          'Date': comment.date
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        worksheet['!cols'] = [
          { width: 8 },
          { width: 25 },
          { width: 40 },
          { width: 15 }
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Instagram Comments');
        XLSX.writeFile(workbook, `Instagram_Comments_${new Date().toISOString().slice(0,10)}.xlsx`);
      });
    });