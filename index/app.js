let assets = [];
let assignments = [];
let userSettings = {
  name: "",
  email: "",
  notifyAssign: false,
  notifyReturn: false,
  notifyDamage: false
};

document.getElementById("assetForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const type = document.getElementById("assetType").value;
  const asset = {
    type,
    brand: document.getElementById("assetBrand").value,
    serial: document.getElementById("serialNumber").value.trim(),
    config: document.getElementById("configuration").value,
    storage: document.getElementById("storage").value,
    damaged: "No",
    resolution: type === "Webcam" ? document.getElementById("webcamResolution").value : "",
    framerate: type === "Webcam" ? document.getElementById("webcamFramerate").value : "",
    camType: type === "Webcam" ? document.getElementById("webcamType").value : "",
    assigned: false
  };
  assets.push(asset);
  alert("Asset added successfully!");
  this.reset();
  updateSummary();
});

document.getElementById("assignForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const serial = document.getElementById("assignSerial").value.trim();
  const asset = assets.find(a => a.serial === serial && !a.assigned);
  if (!asset) return alert("Asset not found or already assigned!");

  const developer = {
    name: document.getElementById("developerName").value,
    id: document.getElementById("developerId").value,
    asset
  };
  asset.assigned = true;
  assignments.push(developer);
  updateAssignmentTable();
  updateSummary();

  if (userSettings.notifyAssign) {
    alert("📧 Email notification: Asset assigned to developer.");
  }

  this.reset();
});

document.getElementById("returnForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("returnIdentifier").value.trim().toLowerCase();
  const index = assignments.findIndex(d => d.name.toLowerCase() === input || d.id.toLowerCase() === input);
  if (index === -1) return alert("No asset found for given developer!");

  assignments[index].asset.assigned = false;
  assignments.splice(index, 1);
  updateAssignmentTable();
  updateSummary();

  if (userSettings.notifyReturn) {
    alert("📧 Email notification: Asset returned.");
  }

  alert("Asset returned successfully.");
  this.reset();
});

document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  const match = assignments.find(d =>
    d.asset.serial.toLowerCase() === input ||
    d.name.toLowerCase() === input ||
    d.id.toLowerCase() === input
  );
  const result = document.getElementById("searchResult");
  if (!match) {
    result.innerHTML = `<div class="alert alert-warning">No matching record found for: <strong>${input}</strong></div>`;
    return;
  }
  result.innerHTML = `
    <div class="p-3 bg-light border rounded">
      <p><strong>Developer:</strong> ${match.name}</p>
      <p><strong>Developer ID:</strong> ${match.id}</p>
      <p><strong>Type:</strong> ${match.asset.type}</p>
      <p><strong>Brand:</strong> ${match.asset.brand}</p>
      <p><strong>Serial:</strong> ${match.asset.serial}</p>
      <p><strong>Configuration:</strong> ${match.asset.config}</p>
      <p><strong>Storage:</strong> ${match.asset.storage}</p>
      <p><strong>Resolution:</strong> ${match.asset.resolution}</p>
      <p><strong>Frame Rate:</strong> ${match.asset.framerate}</p>
      <p><strong>Webcam Type:</strong> ${match.asset.camType}</p>
      <p><strong>Damaged:</strong> ${match.asset.damaged}</p>
    </div>`;
});

function updateAssignmentTable() {
  const table = document.getElementById("assignmentTable");
  table.innerHTML = "";
  assignments.forEach((a, i) => {
    table.innerHTML += `
      <tr class="text-center">
        <td>${i + 1}</td>
        <td>${a.name}</td>
        <td>${a.id}</td>
        <td>${a.asset.type}</td>
        <td>${a.asset.brand}</td>
        <td>${a.asset.serial}</td>
        <td>${a.asset.config}</td>
        <td>${a.asset.damaged}</td>
        <td>Yes</td>
      </tr>`;
  });
}

function updateSummary() {
  document.getElementById("totalAssets").innerText = assets.length;
  document.getElementById("availableAssets").innerText = assets.filter(a => !a.assigned).length;
  document.getElementById("assignedAssets").innerText = assets.filter(a => a.assigned).length;
  document.getElementById("damagedAssets").innerText = assets.filter(a => a.damaged === "Yes").length;
}

// Settings Save
document.getElementById("settingsForm").addEventListener("submit", function (e) {
  e.preventDefault();
  userSettings.name = document.getElementById("settingName").value.trim();
  userSettings.email = document.getElementById("settingEmail").value.trim();
  userSettings.notifyAssign = document.getElementById("notifyAssign").checked;
  userSettings.notifyReturn = document.getElementById("notifyReturn").checked;
  userSettings.notifyDamage = document.getElementById("notifyDamage").checked;
  alert("✅ Settings saved successfully!");
});

// Dummy Logout
function logout() {
  alert("🔒 Logged out successfully!");
  location.reload(); // optional: simulate logout by reloading
}

// Dummy Change Password
function changePassword() {
  alert("🔑 Change password feature is not implemented in this prototype.");
}
