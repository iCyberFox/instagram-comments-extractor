      const loadBtn = document.getElementById('loadBtn');
    const saveBtn = document.getElementById('saveBtn');
    const errorMsg = document.getElementById('errorMsg');
    const tableBody = document.querySelector('#commentsTable tbody');
    let comments = [];

    loadBtn.addEventListener('click', () => {
      const input = document.getElementById('jsonInput').value.trim();
      errorMsg.textContent = '';
      try {
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed)) throw new Error("JSON має бути масивом");

        comments = parsed.map((c, i) => ({
          number: i + 1,
          name: c.name || 'Unknown',
          text: c.text || '',
          date: c.date || new Date().toLocaleDateString('uk-UA')
        }));

        renderTable();
        saveBtn.disabled = false;
      } catch (err) {
        errorMsg.textContent = "Помилка: " + err.message;
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Немає даних</td></tr>`;
        saveBtn.disabled = true;
      }
    });

    function renderTable() {
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
