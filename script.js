 const loadBtn = document.getElementById('loadBtn');
    const saveBtn = document.getElementById('saveBtn');
    const errorMsg = document.getElementById('errorMsg');
    const tableBody = document.querySelector('#commentsTable tbody');
    let comments = [];

    loadBtn.addEventListener('click', () => {
      const postUrl = document.getElementById('postUrl').value.trim();
      errorMsg.textContent = '';
      if (!postUrl || !postUrl.includes('instagram.com')) {
        errorMsg.textContent = "Введіть коректне посилання на Instagram";
        return;
      }

      // Симуляція коментарів (тестові дані)
      comments = [
        { number: 1, name: 'oleg', text: '🔥 Круто!', date: '2025-10-31' },
        { number: 2, name: 'anna', text: 'Дуже гарно!', date: '2025-10-30' },
        { number: 3, name: 'max', text: 'Це топ!', date: '2025-10-29' }
      ];

      renderTable();
      saveBtn.disabled = false;
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
