const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year

  return (
    <footer className="d-flex justify-center py-4 footer mt-4">
      <p>© {currentYear} Your Company Name. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
