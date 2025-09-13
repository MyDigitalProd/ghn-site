import InfoModal from "./InfoModal";

export default function ConfidentialiteModal({ open, onClose }) {
  return (
    <InfoModal
      open={open}
      onClose={onClose}
      title="Politique de confidentialité"
      icon={<span role="img" aria-label="Confidentialité">🔒</span>}
    >
      <div>
        <h3 className="text-xl font-semibold mb-4">Mentions légales & confidentialité</h3>
        <p>
          Ce site respecte la législation RGPD et protège vos données personnelles. Les informations collectées via le formulaire de contact ou WhatsApp sont utilisées uniquement pour répondre à votre demande et ne sont jamais revendues.
        </p>
        <ul className="list-disc ml-6 my-4 text-base">
          <li>Pas de cookies publicitaires</li>
          <li>Pas de tracking tiers</li>
          <li>Vos données ne sont pas partagées sans votre consentement</li>
        </ul>
        <p>
          Pour toute question sur la confidentialité, contactez-nous via le formulaire ou WhatsApp.
        </p>
        <hr className="my-4" />
        <p className="text-sm text-gray-500">GHN Group - SIRET 123 456 789 00012 - contact@ghn-group.com</p>
      </div>
    </InfoModal>
  );
}
