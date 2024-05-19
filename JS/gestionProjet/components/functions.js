
import { db } from "../../database/require.js";
import { doc, getDocs, collection, setDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { deleteUser} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

//====== Roles Create ======

function assignMember(user, nom, prenom){

	//Supprimer le doc de la collection "Pending"
	deleteDoc(doc(db, "Pending", `${user.id}`));

	setDoc(doc(collection(db, "Membres"), user.id), {
		nom: nom,
		prenom: prenom,
		email: user.data().email,
		role: "Membre"
	})
}


//====== Rendu html des users en attente ======

function renderPending(snapshot){

	const usersList = document.getElementById("usersList");

	snapshot.docs.forEach(doc => {
		
		const status = "";
		const lastName = doc.data().nom;
		const firstName = doc.data().prenom;
		const email = doc.data().email;
		const mdp = doc.data().mdp;

		let li = document.createElement("li");

		li.setAttribute("class", "d-flex container-fluid p-0 pe-2 m-0 justify-content-between");

		li.innerHTML = `
		
			<div id="idWrapper" class="col-8 d-flex gap-2">
				<img src="../../../images/images_profils/ppTest.jpg" alt="Photo de profil de l'utilisateur." id="ppUser" class="col-6 img-thumbnail rounded-circle" style="max-width: 30%;">
				
				<section id="idUser" class="d-flex flex-column" style="flex: auto;">
					
					<div class="d-flex align-items-center gap-1">
						<p class="m-0 typTxtOrdi16 fs-5">Nom Prénom</p>
						<span class="typTxtOrdi16 fs-5">|</span>
						<p class="m-0 typTxtOrdi16 fs-6" style=""height: fit-content>date</p>
					</div>
					
					<div id="wrapperUserId" class="d-flex flex-column">
						<!--<p class="m-0 typTxtOrdi16" style="font-size: 9pt;">Statut annoncé: <span>${status}</span></p>-->
						<p class="m-0 typTxtOrdi16" style="font-size: 9pt;">Nom: <span>${lastName}</span></p>
						<p class="m-0 typTxtOrdi16" style="font-size: 9pt;">Prénom: <span>${firstName}</span></p>
						<p class="m-0 typTxtOrdi16" style="font-size: 9pt;">Email: <span>${email}</span></p>
						<p class="m-0 typTxtOrdi16" style="font-size: 9pt;">Mot de passe: <span>${mdp}</span></p>
					</div>
				</section>
			</div>
			
			<div class="d-flex flex-column col-4 btnWrapper align-items-center justify-content-center gap-1">
				
				<button id="validerBtn" class="btn">

					<i class='bx bxs-check-square bx-lg' style='color:#51ff00'></i>

				</button>

				<button id="modifBtn" class="btn text-white" style="background-color: var(--irisBlue); height: fit-content;">Modifier</button>
				
				<button id="refusBtn" class="btn text-white bg-danger" style="height: fit-content;">Refuser</button>
				
			</div>
		
		`;

		li.addEventListener("click", (event) => {

			if (event.target.id == "validerBtn"){

				assignMember(doc, doc.data().nom, doc.data().prenom);

			}else if (event.target.id == "refusBtn"){

				deleteDoc(doc(db, "Pending", `${doc.id}`));

				deleteUser(doc.id)
				.then(() => {
					//l'utilisateur a été supprimé
				})
				.catch((error) => {
					console.log(error.code);
					console.log(error.message);
				})

			}
		})

		return usersList.appendChild(li);

	});
}


export { renderPending };