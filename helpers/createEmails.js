const createEmails = (email, feedback) => {
  const emails = [];

  if (email) {
    const userEmail = {
      to: email,
      subject: 'Feedback Confirmation',
      html: `
        <p>Dear consumer!</p>
        <p>Deeply appreciate your valuable feedback! Your comment means a lot to us, especially since this project was created by a junior full-stack developer. Your insights and suggestions help us improve our service and provide a better experience.</p>
        <p>Here is the feedback you shared:</p>
        <p>"${feedback}"</p>
        <p>Thank you for visiting this service, and we are excited to work towards making it even better for you</p>
        <p>Best regards,</p>
        <p>Oleksandr Moskalets, Fullstack Developer</p>
      `,
    };

    emails.push(userEmail);
  }

  const yourEmail = {
    to: 'oleksandr.moskalets.dev@gmail.com',
    subject: 'User Feedback',
    html: `
      <p>User feedback received:</p>
      <p>From: ${email || 'No email provided'}</p>
      <p>Feedback: ${feedback}</p>
    `,
  };

  emails.push(yourEmail);

  return emails;
};

export default createEmails;
