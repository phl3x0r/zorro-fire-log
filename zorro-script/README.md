# Zorro Script

## About
The writeOpenTrades.c script provide the ability to write open trades to a log file.

It writes the following items to the csv. This format matches the demo apps and zorros trades.csv headers to allow for easy initial integration to the demo app. 

1. Name - Algo Name 
2. Type -long or short
3. Asset -i.e. EUR/USD
4. ID - Trade ID
5. Lots - Lot size
6. Open - Date/Time the trade was opened
7. Exit - The trade has not been exited, so we write the current date/time. 
8. Entry - Trade entry price
9. Exit - The trade has not been exited, so we write the current asset price
10. Profit - Current trade profit
11 Roll - Trade Roll 
12.ExitType - The trade has not been exited, so we write "Open"  

Example:
```
Name,Type,Asset,ID,Lots,Open,Close,Entry,Exit,Profit,Roll,ExitType
EURUSD-8-17CET,Long,EUR/USD,54798973,1,2020-05-05 15:00,2020-05-06 04:02,1.08404,1.08355,-0.59,-0.04,Open
```

## Installation
To install:

1. Place `writeOpenTrades.c` in your Zorro `include` folder. 
2. Place the following in the top section of your trade script. Change the path and name in the #define statement  

```
#define LOG_OPEN_TRADES "C:\\inetpub\\wwwroot\\logs\\STRATEGYNAME_opentrades.csv"
#include <writeOpenTrades.c>
```

3. Determine how often you want to write the open trades. The default is per `tock()`. In Zorro the `tock()` period defaults to every 60000ms. This can be changed with `TockTime = xxxxxx`; This is set in milliseconds. To change this, you can edit the `tock()` section of code in `writeOpenTrades.c`.
Alternatively you can remove the `tock()` code and place code in your `run()` function to write open trades each BarPeriod. For example:  
```
#ifdef LOG_OPEN_TRADES
string tradeLogFile = LOG_OPEN_TRADES;
	writeOpenTrades(tradeLogFile);
#endif
```

Note: Zorro's `tock()` function seems to have a bug in that it will run once (initial run creating the opentrades file) and then not update the file again until after the BarPeriod, then will run on normal `tock()` intervals.  
