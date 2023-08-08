import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { use } from "react";
import { object } from "zod";
import { api } from "~/utils/api";

const CreateRequestWizard = () => {
  const {user} = useUser();
  if (!user) return null;

  return (
    <div className="flex p-2">
      <img src={user.imageUrl} alt="profile image"  className="w-12 h-12 rounded-full"/>
    </div>
  );
}

const ApproveRequestWizard = () => {
  const {user} = useUser();
  if (!user) return null;

  return (
    <div className="flex p-2">
      <img src={user.imageUrl} alt="profile image" className="w-12 h-12 rounded-full"/>
    </div>
  );
}

const CreateWorkflowWizard = () => {
  const {user} = useUser();
  if (!user) return null;

  return (
    <div className="flex w-full">
      <div className="flex p-4 justify-start border-b border-slate-600">
        <img src={user.imageUrl} alt="profile image" className="w-12 h-12 rounded-full justify-start"/>
      </div>
      <br />
      <div className="flex p-4 justify-center">
        <input placeholder="Enter New Workflow Type" className="grow bg-transparent outline-none"></input>
      </div>
    </div>
  );
}

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const user = useUser();

  const {data: requests, isLoading:req_isLoading} = api.requests.getAll.useQuery();
  const {data: approvals, isLoading: app_isLoading} = api.approvals.getAll.useQuery();
  const {data: workflows, isLoading: wf_isLoading} = api.workflows.getAll.useQuery();

  if (req_isLoading) return <div>Loading Requests...</div>;
  if (app_isLoading) return <div>Loading Approvals...</div>;
  if (wf_isLoading) return <div>Loading Workflows...</div>;
  if (!requests) return <div>Something went wrong with Requests</div>;
  if (!approvals) return <div>Something went wrong with Approvals</div>;
  if (!workflows) return <div>Something went wrong with Workflows</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className="w-full md:max-w-2xl border-x border-slate-400">
        <div className="flex border-b border-slate-400 p-4">
          {!user.isSignedIn &&
          <SignInButton mode="modal">
            <button className="btn">
              <div className="flex justify-center">Sign in</div>
            </button>
          </SignInButton>}
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
        <div className="border-b border-slate-400">
          {user.isSignedIn && <CreateWorkflowWizard />}
        </div>
        <div className="flex flex-col">
          <div className="justify-center border-b p-8 border-slate-400"> Requests:</div>
          {[...requests,]?.map((request) => (
            <div className="justify-center border-b p-8 border-slate-400" key={request.id}>
              Request ID: {request.id}<br />
              Request Content:
              <div className="flex justify-center">{request.content}</div>
              Status: {request.status}<br />Workflow Type: {request.workflow.type}<br />
              Requester: {request.requesterId}<br /></div>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="justify-center border-b p-8 border-slate-400"> Approvals:</div>
          {[...approvals,]?.map((approval) => (
            <div className="justify-center border-b p-8 border-slate-400" key={approval.id}>
              Approval ID: {approval.id}<br />
              For Request: {approval.status}<br />
              With Status: {approval.request.status}<br />
              Approver: {approval.approverId}<br /></div>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="justify-center border-b p-8 border-slate-400"> Workflows:</div>
          {[...workflows,]?.map((workflow) => (
            <div className="justify-center border-b p-8 border-slate-400" key={workflow.id}>
              Workflow ID: {workflow.id}<br />
              Workflow Type: {workflow.type}<br />
              Creator: {workflow.adminId}<br /></div>
          ))}
        </div>
        </div>
      </main>
    </>
  );
}
