// ErrorComponent.tsx
import React from "react";

interface ErrorComponentProps {
  /**
   * Message d'erreur détaillé à afficher (optionnel)
   */
  errorMessage?: string;
  /**
   * Adresse email du service de maintenance.
   * Par défaut, 'maintenance@example.com' est utilisée.
   */
  maintenanceContact?: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ errorMessage, maintenanceContact = "maintenance@example.com" }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Oups, une erreur est survenue !</h2>
      <p style={styles.message}>Nous rencontrons actuellement un problème technique.</p>
      {errorMessage && (
        <p style={styles.errorDetails}>
          Détails de l'erreur : <em>{errorMessage}</em>
        </p>
      )}
      <p style={styles.contact}>
        Merci de bien vouloir informer le service de maintenance en envoyant un email à{" "}
        <a href={`mailto:${maintenanceContact}`} style={styles.link}>
          {maintenanceContact}
        </a>{" "}
        afin que le problème puisse être résolu rapidement.
      </p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    border: "1px solid #f44336",
    backgroundColor: "#ffebee",
    color: "#c62828",
    borderRadius: "8px",
    padding: "1rem",
    maxWidth: "600px",
    margin: "1rem auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "0.5rem",
  },
  message: {
    marginBottom: "1rem",
  },
  errorDetails: {
    fontStyle: "italic",
    marginBottom: "1rem",
  },
  contact: {
    fontWeight: "bold",
  },
  link: {
    color: "#c62828",
    textDecoration: "underline",
  },
};

export default ErrorComponent;
