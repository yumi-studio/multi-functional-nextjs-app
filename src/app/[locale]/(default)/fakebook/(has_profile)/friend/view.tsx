import { CircleIconButton } from "@/app/ui/buttons";
import { faAdd, faRemove, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const View = () => {

  const popupConfirmRemoveFriend = (id: string) => async () => {
  }
  
  return (
    <div>
      {[1, 1, 1, 1, 1, 1].map((profile, index) => (
        <div key={index} className="flex gap-2 bg-white p-2 mb-3 rounded-md">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-md">
            <FontAwesomeIcon className="object-center object-cover text-2xl" icon={faUser} />
          </div>
          <div className="flex-auto">
            <div className="font-bold">User {profile}</div>
            <div className="font-normal text-gray-600"><i>The producer</i></div>
          </div>
          {index % 2 === 0 && (
            <CircleIconButton icon={faAdd} color="primary" />
          )}
          {index % 2 !== 0 && (
            <CircleIconButton icon={faRemove} color="error" />
          )}
        </div>
      ))}
    </div>
  )
}

export default View;
