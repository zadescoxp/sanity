import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { Trophy, DollarSign, Users, Shield } from "lucide-react";
import dbConnect from "../../../lib/dbConnect";
import Tournament from "../../../model/Tournament";

async function getTournament(id) {
  await dbConnect();
  if (!id) {
    console.error("Tournament ID is undefined");
    return null;
  }
  try {
    const tournament = await Tournament.findById(id)
      .populate("gameId")
      .populate("organizerId")
      .lean();
    return tournament ? JSON.parse(JSON.stringify(tournament)) : null;
  } catch (error) {
    console.error("Error fetching tournament:", error);
    return null;
  }
}

export default async function TournamentPage({ params }) {
  if (!params || !params.id) {
    return <div>Invalid tournament ID</div>;
  }

  const tournament = await getTournament(params.id);

  if (!tournament) {
    return <div>Tournament not found</div>;
  }

  return (
    <div className="container bg-quinary">
      <div className="overflow-hidden">
        <div className="relative h-64 sm:h-80 lg:h-96 mt-8">
          <div className="absolute inset-0 z-[1] w-full h-full bg-gradient-to-t from-primary to-[transparent]"></div>
          <Image
            src={
              tournament.gameId?.gameBannerPhoto ||
              "/placeholder-tournament.jpg"
            }
            alt={tournament.tournamentName}
            layout="fill"
            objectFit="cover"
            className=""
          />

          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end z-[2]">
            <div className="p-6">
              <h1 className="text-5xl font-semibold text-white mb-2">
                {tournament.tournamentName}
              </h1>
              <div className="flex items-center text-gray-300 space-x-4">
                <span className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-1" />
                  {new Date(
                    tournament.tournamentDates.started
                  ).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-1" />
                  {new Date(
                    tournament.tournamentDates.started
                  ).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-4xl font-semibold mb-4">Tournament Details</h2>
              <div className="space-y-2 text-tertiary font-medium">
                <p className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Prize Pool: $
                  {tournament.prize.reduce(
                    (sum, prize) => sum + prize.amount,
                    0
                  )}
                </p>
                <p className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Participants: {tournament.registeredNumber}/{tournament.slots}
                </p>
                <p className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Mode: {tournament.gameType}
                </p>
                <p className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Entry Fee:{" "}
                  {tournament.prize[0].amount === 0
                    ? "Free"
                    : `₹${tournament.prize[0].amount}`}
                </p>
                <p>
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded ${
                      new Date() < new Date(tournament.tournamentDates.started)
                        ? "bg-green-600"
                        : new Date() >
                            new Date(tournament.tournamentDates.ended)
                          ? "bg-red-600"
                          : "bg-yellow-600"
                    }`}
                  >
                    {new Date() < new Date(tournament.tournamentDates.started)
                      ? "Open"
                      : new Date() > new Date(tournament.tournamentDates.ended)
                        ? "Completed"
                        : "Live"}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-semibold mb-4">Host</h2>
              <div className="flex items-center text-tertiary font-medium">
                <Image
                  src={
                    tournament.organizerId?.bannerPhoto ||
                    "/placeholder-organizer.jpg"
                  }
                  alt={tournament.organizerId?.orgName || "Organizer"}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <span className="ml-4 text-lg">
                  {tournament.organizerId?.orgName || "Unknown Organizer"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-4xl font-semibold mb-4">Description</h2>
            <p className="text-tertiary font-medium">{tournament.gameId?.profile || "No description available"}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-4xl font-semibold mb-4">Rules</h2>
            <p className="text-tertiary font-medium">{tournament.rules}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-4xl font-semibold mb-4">Schedule</h2>
            <div className="flex justify-between items-center max-sm:flex-col">
              <div className="flex items-center justify-between p-4 flex-col text-center">
                <span className="font-medium text-xl">Tournament Starts</span>
                <span className="font-bold text-5xl text-tertiary">
                  {new Date(
                    tournament.tournamentDates.started
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 flex-col text-center">
                <span className="font-medium text-xl">Tournament Ends</span>
                <span className="font-bold text-5xl text-tertiary">
                  {new Date(tournament.tournamentDates.ended).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="group relative mt-8 flex justify-center items-center border-2 p-4 overflow-hidden">
            <Link
              href={`/register/${tournament._id}`}
              className="font-semibold z-[1]"
            >
              Register for Tournament
            </Link>
            <div className="absolute top-[100%] w-full h-full z-0 bg-primary group-hover:top-0 transition-all"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add caching and revalidation
export const revalidate = 60; // Revalidate this page every 60 seconds

// Static tournament data for UI demonstration
// const tournament = {
//     id: "1",
//     image: "/tournament-banner.jpg",
//     title: "KINGS ESPORTS PRO SCRIMS",
//     date: "JUL 1, 2024",
//     time: "11:00 PM",
//     entryFee: 500,
//     mode: "Squad",
//     participants: "16/21",
//     host: {
//         image: "/host-avatar.jpg",
//         name: "KINGS ESPORTS",
//     },
//     status: "Open",
//     prizePool: "$10,000",
//     description: "Join the ultimate BGMI showdown in our Pro Scrims tournament. Prove your skills, compete against the best, and claim your share of the prize pool!",
//     rules: [
//         "Players must be 18 years or older to participate.",
//         "Teams must have 4 players.",
//         "Use of cheats, exploits, or third-party software is strictly prohibited.",
//         "All participants must join the official Discord server for communication.",
//         "Tournament admins have the final say in all disputes."
//     ],
//     schedule: [
//         { stage: "Registration Deadline", date: "JUN 30, 2024", time: "11:59 PM" },
//         { stage: "Tournament Start", date: "JUL 1, 2024", time: "11:00 PM" },
//         { stage: "Quarter Finals", date: "JUL 2, 2024", time: "7:00 PM" },
//         { stage: "Semi Finals", date: "JUL 3, 2024", time: "7:00 PM" },
//         { stage: "Finals", date: "JUL 4, 2024", time: "8:00 PM" }
//     ]
// };
