
import type { Bet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ConfirmBetButton } from './_components/confirm-bet-button';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function getBets(): Promise<Bet[]> {
  try {
    const betsCollection = collection(db, 'bets');
    const q = query(betsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      } as Bet;
    });
  } catch (error) {
    console.error('Failed to read bets from Firestore:', error);
    // On Vercel, this might fail if Firebase isn't configured. Return empty.
    if (process.env.VERCEL && (error as any).code === 'FAILED_PRECONDITION') {
        console.warn("Firestore not configured. Returning empty bets array.");
        return [];
    }
    // For other errors, rethrow or handle as appropriate
    throw new Error("Could not fetch bet data.");
  }
}

export default async function AdminPage() {
  let bets: Bet[] = [];
  try {
    bets = await getBets();
  } catch (error) {
    console.error(error);
    // Render an error state if bets can't be fetched
    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold text-destructive mb-6">Error Loading Bets</h1>
            <p>Could not load bet data from the database. Please ensure Firebase is configured correctly.</p>
        </div>
    );
  }

  const pendingBets = bets.filter(b => b.status === 'pending');
  const otherBets = bets.filter(b => b.status !== 'pending');

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>

      <Card className="mb-8 border-border">
        <CardHeader>
          <CardTitle>Pending Confirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Wager</TableHead>
                <TableHead className="hidden md:table-cell">Details</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingBets.length > 0 ? (
                pendingBets.map(bet => (
                  <TableRow key={bet.id}>
                    <TableCell>
                      <div className="font-medium">{bet.minecraftUsername}</div>
                      <div className="text-sm text-muted-foreground">{bet.discordTag}</div>
                    </TableCell>
                    <TableCell>${bet.wager.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-sm truncate">{bet.details}</TableCell>
                    <TableCell>
                      <ConfirmBetButton betId={bet.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">No pending bets.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Bet History</CardTitle>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Wager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {otherBets.length > 0 ? (
                otherBets.map(bet => (
                  <TableRow key={bet.id}>
                    <TableCell>
                      <div className="font-medium">{bet.minecraftUsername}</div>
                    </TableCell>
                    <TableCell>${bet.wager.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={bet.status === 'active' ? 'default' : 'secondary'}>{bet.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{new Date(bet.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">No bet history.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}

export const dynamic = 'force-dynamic';
