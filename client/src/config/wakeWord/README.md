# Setting Up Your Wake Word with Picovoice Porcupine

To use the Picovoice Porcupine Wake Word software, follow these steps:

1. **Create Your Wake Word**:

   - Go to the [Picovoice Console](https://console.picovoice.ai/login) and create an account or login.
   - Click "Porcupine" in the top menu or go directly to [Porcupine](https://console.picovoice.ai/ppn).
   - Select your language.
   - Type in "Magic Mirror" (or your desired wake word)
     - NOTE: If you decide to use a different wake word, you must update the code accordingly
   - Click "Train".
   - Say your wake word multiple times, varying between different patterns (slow vs fast, high vs low, quiet vs loud, etc.).
   - Download the corresponding directory.

2. **Store the `.ppn` File**:

   - From the downloaded directory, save the `.ppn` file to the `config/wakeWord` directory in your project:
     ```
     /client/src/config/
     ├── wakeWord/
     │   └── Magic-Mirror_en_wasm_v3_0_0.ppn
     ```

3. **Convert the Keword and Model**:

   - Follow these instructions: https://picovoice.ai/docs/quick-start/porcupine-react/
   - Per the instructions use the following script to convert your `.ppn` file to `.js` file: `npx pvbase64 -i ${PORCUPINE_PARAMS_PATH} -o ${OUTPUT_FILE_NAME}.js`

     - If your wake word is "Magic Mirror", version 3 (otherwise, update the `PORCUPINE_PARAMS_PATH`): `npx pvbase64 -i client/src/config/wakeWord/Magic-Mirror_en_wasm_v3_0_0.ppn -o client/src/config/wakeWord/porcupineKeywordBase64.js`

   - OPTIONAL: To ensure the lastest version, per the instructions above, download the `.pv` model file, save it to `config/wakeWord`, and convert to `.js` file: `npx pvbase64 -i ${PORCUPINE_PARAMS_PATH} -o ${OUTPUT_FILE_NAME}.js`

     - If your wake word is "Magic Mirror", version 3 (otherwise, update the `PORCUPINE_PARAMS_PATH`): `npx pvbase64 -i client/src/config/wakeWord/porcupine_params.pv -o client/src/config/wakeWord/porcupineModelBase64.js`

4. **Add to `.gitignore`**:

   - Ensure that the `.ppn` and keyword files are not tracked by Git by adding the following line to your `.gitignore` file, if named differently than listed above.

5. **Set the Environment Variable**:

   - Set an environment variable to store the path to your `.ppn` file.

   #### On macOS/Linux:

   ```bash
   export PICOVOICE_PPN_PATH=/path/to/your/project/config/wakeWord.ppn
   ```
