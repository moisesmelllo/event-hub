import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid Json data format" },
        { status: 400 }
      );
    }

    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const updloadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, results) => {
            if (error) return reject(error);

            resolve(results);
          }
        )
        .end(buffer);
    });

    event.image = (updloadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create(event);

    return NextResponse.json(
      { message: "Event created successfuly", event: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: error instanceof Error ? error.message : "Unknown",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Busca eventos e ordena do mais novo para o mais antigo
    const events = await Event.find({}).sort({ createdAt: -1 });

    // RETORNO IMPORTANTE: Estamos retornando um objeto com a chave "events"
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Erro no GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
