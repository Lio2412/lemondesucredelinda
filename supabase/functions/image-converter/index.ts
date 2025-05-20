// @ts-ignore: Deno imports are not recognized by VS Code without Deno LSP
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore: Deno imports are not recognized by VS Code without Deno LSP
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-ignore: Deno imports are not recognized by VS Code without Deno LSP
import heicConvert from 'https://esm.sh/heic-convert@1.2.4'; // Assurez-vous que cette version est compatible Deno ou trouvez une alternative

console.log("Image Converter Edge Function initialized");

serve(async (req: Request) => { // Typage de req
  try {
    const supabaseClient = createClient( // Typage de supabaseClient inféré
      // @ts-ignore: Deno specific
      Deno.env.get("SUPABASE_URL") ?? "",
      // @ts-ignore: Deno specific
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { filePath, bucketName } = await req.json();

    if (!filePath || !bucketName) {
      return new Response(
        JSON.stringify({ error: "filePath and bucketName are required." }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 1. Télécharger le fichier original
    const { data: downloadData, error: downloadError } = await supabaseClient
      .storage
      .from(bucketName)
      .download(filePath);

    if (downloadError) {
      console.error("Error downloading file:", downloadError);
      return new Response(
        JSON.stringify({ error: "Failed to download file.", details: downloadError.message }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    if (!downloadData) {
        return new Response(
            JSON.stringify({ error: "File not found or empty." }),
            { headers: { "Content-Type": "application/json" }, status: 404 }
        );
    }

    const imageBuffer = await downloadData.arrayBuffer();
    const contentType = downloadData.type; // Supabase SDK v2 infère le type à partir de l'extension ou des métadonnées

    // 2. Vérifier le type MIME
    if (contentType === 'image/heic' || contentType === 'image/heif') {
      console.log(`File ${filePath} is HEIC/HEIF, attempting conversion.`);
      let outputBuffer;
      try {
        // 3. Convertir l'image
        outputBuffer = await heicConvert({
          buffer: imageBuffer,
          format: 'JPEG',
          quality: 0.9
        });
      } catch (conversionError: unknown) { // Typage de conversionError
        console.error("Error converting HEIC/HEIF image:", conversionError);
        const message = conversionError instanceof Error ? conversionError.message : "Unknown conversion error";
        return new Response(
          JSON.stringify({ error: "Failed to convert image.", details: message }),
          { headers: { "Content-Type": "application/json" }, status: 500 }
        );
      }

      // 5. Déterminer un nouveau nom de fichier
      const originalFileName = filePath.split('/').pop() || 'converted.jpg';
      const baseName = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
      const newFileName = `${baseName}.jpg`;
      const newFilePath = filePath.substring(0, filePath.lastIndexOf('/') + 1) + newFileName;

      // 6. Uploader le fichier converti
      const { error: uploadError } = await supabaseClient
        .storage
        .from(bucketName)
        .upload(newFilePath, outputBuffer, { contentType: 'image/jpeg', upsert: true });

      if (uploadError) {
        console.error("Error uploading converted file:", uploadError);
        return new Response(
          JSON.stringify({ error: "Failed to upload converted file.", details: uploadError.message }),
          { headers: { "Content-Type": "application/json" }, status: 500 }
        );
      }
      console.log(`Successfully converted and uploaded ${newFilePath}`);

      // 7. Supprimer le fichier original
      const { error: deleteError } = await supabaseClient
        .storage
        .from(bucketName)
        .remove([filePath]);

      if (deleteError) {
        // Ne pas bloquer si la suppression échoue, mais logger l'erreur
        console.warn("Failed to delete original HEIC file:", deleteError);
      } else {
        console.log(`Successfully deleted original file ${filePath}`);
      }

      // 8. Retourner les informations nécessaires
      const { data: { publicUrl } } = supabaseClient.storage.from(bucketName).getPublicUrl(newFilePath);
      return new Response(
        JSON.stringify({ success: true, message: "Image converted successfully.", newFilePath, publicUrl }),
        { headers: { "Content-Type": "application/json" }, status: 200 }
      );

    } else {
      // 9. Si aucune conversion n'est nécessaire
      console.log(`File ${filePath} is not HEIC/HEIF (${contentType}), no conversion needed.`);
      const { data: { publicUrl } } = supabaseClient.storage.from(bucketName).getPublicUrl(filePath);
      return new Response(
        JSON.stringify({ success: true, message: "No conversion needed.", filePath, publicUrl }),
        { headers: { "Content-Type": "application/json" }, status: 200 }
      );
    }

  } catch (error: unknown) { // Typage de error
    console.error("Unhandled error in Edge Function:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred.", details: message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
})
