let array = [];
let comparisons = 0;
let delay = 400;
let isSorting = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== Generate Array =====
function generateArray() {
    resetArray(false);

    const manualInput = document.getElementById("manualArray").value.trim();
    const sizeInput = document.getElementById("arraySize").value;

    if (manualInput !== "") {
        array = manualInput
            .split(",")
            .map(v => parseInt(v.trim()))
            .filter(v => !isNaN(v));
    } else {
        if (!sizeInput) {
            alert("Enter array size or manual array");
            return;
        }

        const size = parseInt(sizeInput);
        array = [];
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * 90) + 10);
        }
    }

    comparisons = 0;
    document.getElementById("comparisonCount").innerText = comparisons;
    renderArray();
}

// ===== Render Array =====
function renderArray(active = [], sorted = []) {
    const container = document.getElementById("arrayContainer");
    container.innerHTML = "";

    if (array.length === 0) return;

    const maxVal = Math.max(...array);

    array.forEach((value, index) => {
        const barContainer = document.createElement("div");
        barContainer.className = "bar-container";

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = (value / maxVal) * 300 + "px";

        if (active.includes(index)) bar.classList.add("active");
        if (sorted.includes(index)) bar.classList.add("sorted");

        const label = document.createElement("div");
        label.className = "bar-value";
        label.innerText = value;

        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        container.appendChild(barContainer);
    });
}

// ===== Start Sort =====
async function startSort() {
    if (isSorting) return;

    const algo = document.getElementById("algorithm").value;
    if (!algo) {
        alert("Please select an algorithm");
        return;
    }

    if (array.length === 0) {
        alert("Generate array first");
        return;
    }

    isSorting = true;

    switch (algo) {
        case "bubble":
            await bubbleSort();
            break;
        case "selection":
            await selectionSort();
            break;
        case "insertion":
            await insertionSort();
            break;
        case "merge":
            await mergeSort(0, array.length - 1);
            break;
        case "quick":
            await quickSort(0, array.length - 1);
            break;
        case "heap":
            await heapSort();
            break;
    }

    renderArray([], array.map((_, i) => i));
    isSorting = false;
}


// ===== Insertion Sort (CORRECT) =====
async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;

        while (j >= 0 && array[j] > key) {
            comparisons++;
            document.getElementById("comparisonCount").innerText = comparisons;

            array[j + 1] = array[j];
            renderArray([j, j + 1]);
            await sleep(delay);
            j--;
        }

        array[j + 1] = key;
        renderArray([j + 1]);
        await sleep(delay);
    }
}

// ===== Reset =====
function resetArray(clearInputs = true) {
    isSorting = false;
    array = [];
    comparisons = 0;

    document.getElementById("arrayContainer").innerHTML = "";
    document.getElementById("comparisonCount").innerText = "0";

    if (clearInputs) {
        document.getElementById("arraySize").value = "";
        document.getElementById("manualArray").value = "";
        document.getElementById("algorithm").selectedIndex = 0;
    }
}
async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            comparisons++;
            document.getElementById("comparisonCount").innerText = comparisons;

            renderArray([j, j + 1]);
            await sleep(delay);

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                renderArray([j, j + 1]);
                await sleep(delay);
            }
        }
    }
}
async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let minIdx = i;

        for (let j = i + 1; j < array.length; j++) {
            comparisons++;
            document.getElementById("comparisonCount").innerText = comparisons;

            renderArray([minIdx, j]);
            await sleep(delay);

            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }

        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            renderArray([i, minIdx]);
            await sleep(delay);
        }
    }
}
async function mergeSort(l, r) {
    if (l >= r) return;

    const m = Math.floor((l + r) / 2);
    await mergeSort(l, m);
    await mergeSort(m + 1, r);
    await merge(l, m, r);
}

async function merge(l, m, r) {
    let left = array.slice(l, m + 1);
    let right = array.slice(m + 1, r + 1);

    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
        comparisons++;
        document.getElementById("comparisonCount").innerText = comparisons;

        if (left[i] <= right[j]) {
            array[k++] = left[i++];
        } else {
            array[k++] = right[j++];
        }
        renderArray([k - 1]);
        await sleep(delay);
    }

    while (i < left.length) {
        array[k++] = left[i++];
        renderArray([k - 1]);
        await sleep(delay);
    }

    while (j < right.length) {
        array[k++] = right[j++];
        renderArray([k - 1]);
        await sleep(delay);
    }
}
async function quickSort(low, high) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    let pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        comparisons++;
        document.getElementById("comparisonCount").innerText = comparisons;

        renderArray([j, high]);
        await sleep(delay);

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            renderArray([i, j]);
            await sleep(delay);
        }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    renderArray([i + 1, high]);
    await sleep(delay);

    return i + 1;
}
async function heapSort() {
    let n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        renderArray([0, i]);
        await sleep(delay);

        await heapify(i, 0);
    }
}

async function heapify(n, i) {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n && array[l] > array[largest]) largest = l;
    if (r < n && array[r] > array[largest]) largest = r;

    comparisons++;
    document.getElementById("comparisonCount").innerText = comparisons;

    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        renderArray([i, largest]);
        await sleep(delay);
        await heapify(n, largest);
    }
}
