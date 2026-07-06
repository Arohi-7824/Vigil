import { createRisk } from "../services/api";

<input type="file" onChange={(e) => setImage(e.target.files[0])} />

const handleSubmit = async () => {
  await createRisk({
    description,
    latitude,
    longitude,
    image
  });
};