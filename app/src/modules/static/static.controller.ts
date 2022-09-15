import { Controller, Get, Req, Res } from "@nestjs/common";
import { Response } from "express";
import Request from "../../types/Request";

@Controller()
class StaticController {
  @Get("/")
  public home(@Req() req: Request, @Res() res: Response): void {
    res.render("home");
  }

  @Get("/join")
  public join(@Req() req: Request, @Res() res: Response): void {
    res.render("join");
  }

  @Get("/login")
  public login(@Req() req: Request, @Res() res: Response): void {
    res.render("signin");
  }
}

export default StaticController;
