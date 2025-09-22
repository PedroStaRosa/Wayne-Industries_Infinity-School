import ButtonComponent from "../button";

interface ConfirmModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  textLoadingAction: string;
  loading: boolean;
}

const ConfirmModal = ({
  children,
  textLoadingAction,
  loading,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h5 className="text-lg font-semibold">Confirmação</h5>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="mb-6">{children}</div>

        <div className="flex justify-end gap-3">
          <ButtonComponent
            disabled={loading}
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </ButtonComponent>
          {/*           <button
            disabled={loading}
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fechar
          </button> */}
          <ButtonComponent
            variant="submit"
            disabled={loading}
            type="button"
            onClick={onConfirm}
          >
            {loading ? textLoadingAction : "Confirmar"}
          </ButtonComponent>
          {/*           <button
            disabled={loading}
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? textLoadingAction : "Confirmar"}
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
