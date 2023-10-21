const createEmail = (email, feedback) => {
  console.log(email, feedback);
  const newEmail = {
    to: email,
    subject: 'Тест',
    html: `
      <p>Вітаємо!</p>
      <p>Test test test</p>
      <p>feedback: ${feedback}</p>
      <p>Дякуємо, що обрали наш сервіс!</p>
    `,
  };

  return newEmail;
};

export default createEmail;
