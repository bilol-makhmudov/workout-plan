document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById('planFile');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadStatus = document.getElementById('upload-status');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; 
        if (file) {
            fileNameDisplay.textContent = file.name;
            uploadStatus.textContent = '';

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const fileContent = e.target.result;
                    const workoutPlan = JSON.parse(fileContent);

                    if (typeof workoutPlan === 'object' && workoutPlan !== null && Object.keys(workoutPlan).length > 0) {
                        localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));


                        uploadStatus.textContent = 'Workout plan uploaded and saved successfully!';
                        uploadStatus.className = 'status-success';

                        console.log("Workout plan saved to localStorage:", workoutPlan);

                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 5000);

                    } else {
                        uploadStatus.textContent = 'Invalid workout plan format. Please check your JSON file.';
                        uploadStatus.className = 'status-error';
                        console.error("Invalid workout plan format:", workoutPlan);
                    }

                } catch (error) {
                    // Handle JSON parsing errors
                    uploadStatus.textContent = 'Error reading file: Invalid JSON format.';
                    uploadStatus.className = 'status-error';
                    console.error("Error parsing JSON file:", error);
                }
            };

            reader.onerror = () => {
                uploadStatus.textContent = 'Error reading file.';
                uploadStatus.className = 'status-error';
                console.error("Error reading file:", reader.error);
            };
            reader.readAsText(file);

        } else {
            fileNameDisplay.textContent = 'No file chosen';
            uploadStatus.textContent = '';
        }
    });
});
