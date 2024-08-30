"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../@/components/ui/form";
import { Input } from "../../../@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { teamSchema } from "../../../model/Schema/teamSchema";
import { useToast } from "../../../@/components/ui/use-toast";

export default function CreateTeamForm() {
  const [teamname, setTeamname] = useState("");
  const [game, setGame] = useState("");
  const [role, setRole] = useState("");
  const [rank, setRank] = useState("");
  const [server, setServer] = useState("");
  const [language, setLanguage] = useState("");
  const [players, setPlayers] = useState("");
  const [requests, setRequests] = useState("");
  const [participantCount, setParticipantCount] = useState("");
  const [preview, setPreview] = useState(false);

  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      teamname: "",
      game: "",
      role: "",
      rank: "",
      server: "",
      language: "",
      players: "",
      requests: "",
      participantCount: "",
    },
    shouldFocusError: false,
  });

  const { reset } = form;

  const onSubmit = async (data) => {
    try {
      if (
        teamname !== "" &&
        game !== "" &&
        role !== "" &&
        rank !== "" &&
        server !== "" &&
        language !== "" &&
        players !== "" &&
        requests !== "" &&
        participantCount !== ""
      ) {
        const playersArray = players.split(",").map((player) => player.trim());
        const dataWithPlayersArray = {
          ...data,
          players: playersArray,
          participantCount: parseInt(participantCount, 10),
        };

        const response = await axios.post(
          "/api/teams/create-team",
          dataWithPlayersArray
        );

        toast({
          title: "Success",
          description: response.data.message,
        });

        reset();
        setTeamname("");
        setGame("");
        setRole("");
        setRank("");
        setServer("");
        setLanguage("");
        setPlayers("");
        setRequests("");
        setParticipantCount("");
      }
    } catch (error) {
      console.error("Error during create-team:", error);
      toast({
        title: "Team Creation Failed",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-3/4 bg-quinary p-8">
        {/* Preview  */}
        {preview ? (
          <div className="w-full bg-quinary p-8 z-10 absolute inset-0">
            <div className="flex justify-between items-center border-b-2 pb-6">
              <h1 className="text-4xl font-semibold">Preview</h1>
              <button onClick={() => setPreview(false)} className="text-xl text-[red]">Close</button>
            </div>

            <div className="mt-10">
              <span className="flex justify-start items-end gap-4">
                <h1 className="text-2xl font-semibold">Team Name: </h1>
                <p className="font-medium">{teamname || 'No Team Name'}</p>
              </span>
              
              <span className="flex justify-start items-end gap-4">
                <h1 className="text-2xl font-semibold">Game: </h1>
                <p className="font-medium">{game || 'No Game'}</p>
              </span>
              
              <span className="flex justify-start items-end gap-4">
                <h1 className="text-2xl font-semibold">Role: </h1>
                <p className="font-medium">{role || 'No Role'}</p>
              </span>
              
              <span className="flex justify-start items-end gap-4">
                <h1 className="text-2xl font-semibold">Rank: </h1>
                <p className="font-medium">{rank || 'No Rank'}</p>
              </span>
              
              <span className="flex justify-start items-end gap-4">
                <h1 className="text-2xl font-semibold">Server: </h1>
                <p className="font-medium">{server || 'No Server'}</p>
              </span>
              
              <span className="flex justify-start items-end gap-4">
                <h1 className="text-2xl font-semibold">Language: </h1>
                <p className="font-medium">{language || 'No Language'}</p>
              </span>
              
              <span className="flex justify-start items-end gap-4">
                <h1 className="text-2xl font-semibold">Players: </h1>
                <p className="font-medium">{players || 'No Players'}</p>
              </span>
              
              <span className="flex justify-start items-end gap-4">
                <h1 className="text-2xl font-semibold">Requests: </h1>
                <p className="font-medium">{requests || 'No Requests'}</p>
              </span>
              
              <span className="flex justify-start items-end gap-4">
                <h1 className="text-2xl font-semibold">Number of Players: </h1>
                <p className="font-medium">{participantCount || 'No players added'}</p>
              </span>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="text-center border-b">
          <h2 className="scroll-m-20 pb-8 text-5xl font-semibold first:mt-0">
            Create Your Team
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        className="border-0 outline-none pl-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[red]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Team Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name of your team"
                        className="border-0 outline-none p-6 pl-0 border-b-tertiary border-b-4 rounded-none hover:border-b-primary focus:border-b-secondary"
                        {...field}
                        value={teamname}
                        onChange={(e) => {
                          field.onChange(e);
                          setTeamname(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[red]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="game"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Game</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Game you play"
                        className="border-0 outline-none p-6 pl-0 border-b-tertiary border-b-4 rounded-none hover:border-b-primary focus:border-b-secondary"
                        {...field}
                        value={game}
                        onChange={(e) => {
                          field.onChange(e);
                          setGame(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[red]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Role</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Role in the game"
                        className="border-0 outline-none p-6 pl-0 border-b-tertiary border-b-4 rounded-none hover:border-b-primary focus:border-b-secondary"
                        {...field}
                        value={role}
                        onChange={(e) => {
                          field.onChange(e);
                          setRole(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[red]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Rank</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your rank"
                        className="border-0 outline-none p-6 pl-0 border-b-tertiary border-b-4 rounded-none hover:border-b-primary focus:border-b-secondary"
                        {...field}
                        value={rank}
                        onChange={(e) => {
                          field.onChange(e);
                          setRank(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[red]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="server"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Server</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Preferred server"
                        className="border-0 outline-none p-6 pl-0 border-b-tertiary border-b-4 rounded-none hover:border-b-primary focus:border-b-secondary"
                        {...field}
                        value={server}
                        onChange={(e) => {
                          field.onChange(e);
                          setServer(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[red]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Language</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Language you speak"
                        className="border-0 outline-none p-6 pl-0 border-b-tertiary border-b-4 rounded-none hover:border-b-primary focus:border-b-secondary"
                        {...field}
                        value={language}
                        onChange={(e) => {
                          field.onChange(e);
                          setLanguage(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[red]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="players"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Players</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="player_1 , player_2 , ..."
                        className="border-0 outline-none p-6 pl-0 border-b-tertiary border-b-4 rounded-none hover:border-b-primary focus:border-b-secondary"
                        {...field}
                        value={players}
                        onChange={(e) => {
                          field.onChange(e);
                          setPlayers(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[red]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Requests</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Special requests"
                        className="border-0 outline-none p-6 pl-0 border-b-tertiary border-b-4 rounded-none hover:border-b-primary focus:border-b-secondary"
                        {...field}
                        value={requests}
                        onChange={(e) => {
                          field.onChange(e);
                          setRequests(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[red]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="participantCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">
                      Number of Participants
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Number of participants"
                        className="border-0 outline-none p-6 pl-0 border-b-tertiary border-b-4 rounded-none hover:border-b-primary focus:border-b-secondary"
                        {...field}
                        value={participantCount}
                        onChange={(e) => {
                          field.onChange(e);
                          setParticipantCount(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[red]" />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center gap-10 mt-10">
              <button
                className="group relative bg-tertiary overflow-hidden px-8 py-4 font-semibold"
                onClick={() => setPreview(true)}
              >
                <p className="text-primary relative inset-0 group-hover:text-tertiary z-[1]">
                  Preview
                </p>
                <div className="absolute left-0 top-[100%] bg-primary w-full h-full group-hover:top-0 transition-all z-0"></div>
              </button>
              <button
                type="submit"
                className="group relative bg-tertiary overflow-hidden px-8 py-4 font-semibold"
              >
                <p className="text-primary relative inset-0 group-hover:text-tertiary z-[1]">
                  Create
                </p>
                <div className="absolute left-0 -top-[100%] bg-primary w-full h-full group-hover:top-0 transition-all z-0"></div>
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
