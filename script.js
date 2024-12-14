function allocateMemory() {
    const blockSizes = document.getElementById('blockSizes').value.split(',').map(num => parseInt(num.trim()));
    const processSizes = document.getElementById('processSizes').value.split(',').map(num => parseInt(num.trim()));

    const blocksContainer = document.getElementById('blocks');
    blocksContainer.innerHTML = '';
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';

    // Create blocks on the screen
    const blockElements = [];
    const blockStatus = []; // To track the remaining space in each block and allocations

    blockSizes.forEach((size, index) => {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.height = `${size / 2}px`; // Dynamic height based on block size
        block.style.backgroundColor = 'green'; // Initial block color
        block.style.border = '2px solid black'; // Block outline
        block.dataset.size = size; // Store the block size as data attribute
        block.dataset.index = index; // Store the block index
        block.innerHTML = `<div class="block-name">Block ${index + 1}: ${size} KB</div>`;
        blocksContainer.appendChild(block);
        blockElements.push(block); // Store block elements for further manipulation

        blockStatus.push({
            remaining: size,
            allocated: 0,
            processes: [], // To track allocated processes in the block
        });
    });

    let animationDelay = 0;

    // Allocate memory for each process
    processSizes.forEach((process, processIndex) => {
        let maxBlockIndex = -1;
        let maxBlockSize = -1;

        // Find the worst-fit block (largest block that can fit the process)
        blockStatus.forEach((block, blockIndex) => {
            if (block.remaining >= process && block.remaining > maxBlockSize) {
                maxBlockSize = block.remaining;
                maxBlockIndex = blockIndex;
            }
        });

        if (maxBlockIndex !== -1) {
            const block = blockElements[maxBlockIndex];
            blockStatus[maxBlockIndex].remaining -= process; // Update block remaining space after allocation
            blockStatus[maxBlockIndex].allocated += process; // Track the allocated space in the block
            blockStatus[maxBlockIndex].processes.push(`P${processIndex + 1}: ${process} KB`); // Store process details

            const allocatedSpace = blockStatus[maxBlockIndex].allocated;
            const remainingSpace = blockStatus[maxBlockIndex].remaining;
            const blockSize = block.dataset.size;

            setTimeout(() => {
                // Update the block's color to represent allocated and remaining memory
                block.innerHTML = `<div class="block-name">Block ${maxBlockIndex + 1}: ${blockSize} KB</div>`;

                // Animate allocated space in yellow
                const allocatedDiv = document.createElement('div');
                allocatedDiv.style.height = `${allocatedSpace / 2}px`;
                allocatedDiv.style.backgroundColor = 'yellow';
                allocatedDiv.style.width = '100%';
                allocatedDiv.style.position = 'absolute';
                allocatedDiv.style.bottom = '0'; // Stack allocated space at the bottom
                allocatedDiv.textContent = `${allocatedSpace} KB Allocated`;
                allocatedDiv.style.color = 'black';
                allocatedDiv.style.textAlign = 'center';
                block.appendChild(allocatedDiv);

                // Animate remaining space in green
                const remainingDiv = document.createElement('div');
                remainingDiv.style.height = `${remainingSpace / 2}px`;
                remainingDiv.style.backgroundColor = 'green';
                remainingDiv.style.width = '100%';
                remainingDiv.style.position = 'absolute';
                remainingDiv.style.bottom = `${allocatedSpace / 2}px`; // Position it above the allocated memory
                remainingDiv.textContent = `${remainingSpace} KB Remaining`;
                remainingDiv.style.color = 'black';
                remainingDiv.style.textAlign = 'center';
                block.appendChild(remainingDiv);
            }, animationDelay);

            animationDelay += 1000; // Adding delay between animations
        }
    });

    // After all processes are allocated, show the final allocation result
    setTimeout(() => {
        resultContainer.innerHTML = '<h2>Allocation Results:</h2>';
        blockStatus.forEach((block, index) => {
            const processDetails = block.processes.length > 0 ? block.processes.join(', ') : 'No processes allocated';
            resultContainer.innerHTML += `<br>Block ${index + 1}: ${block.allocated} KB allocated, ${block.remaining} KB remaining.<br>Processes: ${processDetails}`;
        });
    }, animationDelay);
}
