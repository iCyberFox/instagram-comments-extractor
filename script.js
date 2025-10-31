    document.addEventListener('DOMContentLoaded', function() {
      const loadBtn = document.getElementById('loadBtn');
      const saveBtn = document.getElementById('saveBtn');
      const errorMsg = document.getElementById('errorMsg');
      const tableBody = document.querySelector('#commentsTable tbody');
      let comments = [];

      loadBtn.addEventListener('click', async () => {
        const username = document.getElementById('instaUsername').value.trim();
        const password = document.getElementById('instaPassword').value.trim();
        const postUrl = document.getElementById('postUrl').value.trim();

        if (!username || !password || !postUrl) {
          showError("Заповніть всі поля: логін, пароль і посилання");
          return;
        }

        showMessage("Завантаження коментарів...");
        saveBtn.disabled = true;

        try {
          const response = await fetch('https://instagram-backend-hsh7.onrender.com', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password, postUrl })
          });

          if (!response.ok) throw new Error("Помилка при запиті до сервера");

          const data = await response.json();
          if (!data.comments || data.comments.length === 0) {
            showMessage("Коментарі не знайдені");
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
          showError("Не вдалося отримати коментарі");
        }
      });

      function showMessage(msg) {
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
