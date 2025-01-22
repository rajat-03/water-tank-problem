function calculateWaterStorage() {
  const renderTables = (heightArray) => {
    let totalColumns = heightArray.length;
    const max = Math.max(...heightArray);
    const modifiedHeightArray = [max, ...heightArray, max];
    totalColumns = modifiedHeightArray.length;

    let tableWithWallsHTML = "";
    let tableWaterOnlyHTML = "";
    let totalWaterUnits = 0;

    // Step 1 - Precompute leftMaxHeights  and rightMaxHeights  arrays
    const leftMaxHeights = Array(totalColumns).fill(0);
    const rightMaxHeights = Array(totalColumns).fill(0);

    leftMaxHeights[0] = modifiedHeightArray[0];
    for (let i = 1; i < totalColumns; i++) {
      leftMaxHeights[i] = Math.max(
        leftMaxHeights[i - 1],
        modifiedHeightArray[i]
      );
    }

    rightMaxHeights[totalColumns - 1] = modifiedHeightArray[totalColumns - 1];
    for (let i = totalColumns - 2; i >= 0; i--) {
      rightMaxHeights[i] = Math.max(
        rightMaxHeights[i + 1],
        modifiedHeightArray[i]
      );
    }

    // Step 2 - Build the tables
    for (let i = max; i > 0; i--) {
      tableWithWallsHTML += "<tr>";
      tableWaterOnlyHTML += "<tr>";
      for (let j = 0; j < totalColumns; j++) {
        // Walls (yellow)
        if (modifiedHeightArray[j] >= i) {
          tableWithWallsHTML += "<td class='bg-warning'></td>"; // Wall
          tableWaterOnlyHTML += "<td></td>"; // No wall in "water-only" table
        }
        // Water (blue)
        else if (
          modifiedHeightArray[j] < i &&
          leftMaxHeights[j] >= i &&
          rightMaxHeights[j] >= i
        ) {
          tableWithWallsHTML += "<td class='bg-primary'></td>"; // Water
          tableWaterOnlyHTML += "<td class='bg-primary'></td>"; // Water
          totalWaterUnits++;
        }
        // Empty spaces
        else {
          tableWithWallsHTML += "<td></td>";
          tableWaterOnlyHTML += "<td></td>";
        }
      }
      tableWithWallsHTML += "</tr>";
      tableWaterOnlyHTML += "</tr>";
    }

    // Update the HTML content
    document.querySelector("#tank-with-walls").innerHTML = tableWithWallsHTML;
    document.querySelector("#tank-water-only").innerHTML = tableWaterOnlyHTML;
    document.querySelector("#result").innerHTML = totalWaterUnits + " Units";
  };

  const unitsInput = document.getElementById("unitinput").value;
  if (!unitsInput.trim()) {
    alert("Please enter a valid input.");
    return;
  }

  try {
    const inputArray = unitsInput.split(",").map(Number);
    if (inputArray.some(isNaN)) {
      throw new Error("Invalid input");
    }

    renderTables(inputArray);
  } catch (err) {
    alert("Error: Please provide a comma-separated list of numbers.");
  }
}
