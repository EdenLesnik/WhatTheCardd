import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { TUser } from "../../Types/TUser";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

type UserEditModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  user: TUser;
  onUpdate: (updatedUser: TUser) => void;
};

const UserEditModal = ({ isOpen, closeModal, user, onUpdate }: UserEditModalProps) => {
  const { register, handleSubmit, setValue } = useForm<TUser>({
    defaultValues: user,
  });

  const submitForm = async (data: TUser) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/${user._id}`,
        data,
        { headers: { "x-auth-token": token } }
      );

      onUpdate(res.data); // Update the user in the parent component
      toast.success("User details updated successfully");
      closeModal();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Edit User
                </Dialog.Title>

                <form onSubmit={handleSubmit(submitForm)} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium">First Name</label>
                    <input
                      {...register("name.first")}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Last Name</label>
                    <input
                      {...register("name.last")}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    {/* Cancel Button */}
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4  text-white py-2 bg-red-400 rounded-md hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>

                    {/* Save Button */}
                    <button
                      type="submit"
                      className="px-4 text-white bg-green-300 bg-gradient-to-r from-green-600 to-black-500 dark:bg-gradient-to-r from-green-300 to-blue-500-600 py-3 rounded-md transition hover:scale-105"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserEditModal;
